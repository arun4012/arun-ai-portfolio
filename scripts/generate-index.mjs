#!/usr/bin/env node
/**
 * generate-index.mjs
 * Reads all files in knowledge/, chunks markdown by headings,
 * optionally calls Cloudflare Workers AI REST API for BGE embeddings,
 * and writes the vector index to public/knowledge-index.json.
 * Also copies knowledge/profile.json -> src/assets/profile.json.
 *
 * Usage:
 *   node scripts/generate-index.mjs
 *
 * Env vars (optional — if not set, embeddings will be zero-vectors):
 *   CF_ACCOUNT_ID   Your Cloudflare account ID
 *   CF_API_TOKEN    A Cloudflare API token with Workers AI:Read permission
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const KNOWLEDGE_DIR = join(ROOT, 'knowledge');
const OUTPUT_PATH = join(ROOT, 'public', 'knowledge-index.json');
const PROFILE_SRC = join(KNOWLEDGE_DIR, 'profile.json');
const PROFILE_DEST = join(ROOT, 'src', 'assets', 'profile.json');

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';
const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';
const CHUNK_SIZE = 400; // characters

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Split a markdown string into chunks keyed by heading sections.
 * Each chunk is ~CHUNK_SIZE characters. Section text is split further
 * if longer than the limit.
 */
function chunkMarkdown(content, source) {
  const chunks = [];
  // Split on ## or ### headings (keep the delimiter)
  const sections = content.split(/(?=^#{2,3}\s)/m);

  for (const section of sections) {
    const lines = section.split('\n');
    const headingLine = lines[0].trim();
    const sectionName = headingLine.startsWith('#')
      ? headingLine.replace(/^#+\s*/, '')
      : 'Introduction';
    const body = lines.slice(1).join('\n').trim();

    if (!body) continue;

    // Further split body into ~CHUNK_SIZE character pieces
    let start = 0;
    let chunkIndex = 0;
    while (start < body.length) {
      // Try to split on sentence boundary near CHUNK_SIZE
      let end = start + CHUNK_SIZE;
      if (end < body.length) {
        const sentenceEnd = body.lastIndexOf('.', end);
        if (sentenceEnd > start + CHUNK_SIZE / 2) {
          end = sentenceEnd + 1;
        }
      } else {
        end = body.length;
      }

      const text = body.slice(start, end).trim();
      if (text) {
        chunks.push({
          id: `${source}-${sectionName.replace(/\s+/g, '-').toLowerCase()}-${chunkIndex}`,
          source,
          section: sectionName,
          text,
          embedding: [], // filled in later
        });
        chunkIndex++;
      }
      start = end;
    }
  }

  return chunks;
}

/**
 * Call Cloudflare Workers AI REST API to get a BGE embedding for a text.
 * Returns a number[] or [] if the API call fails / creds not set.
 */
async function fetchEmbedding(text) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return [];

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${encodeURIComponent(EMBEDDING_MODEL)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: [text] }),
    });

    if (!res.ok) {
      console.warn(`  ⚠ Embedding API returned ${res.status} for chunk — using zero vector`);
      return [];
    }

    const json = await res.json();
    return json?.result?.data?.[0] ?? [];
  } catch (err) {
    console.warn(`  ⚠ Embedding fetch error: ${err.message} — using zero vector`);
    return [];
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Scanning knowledge/ directory…');

  if (!existsSync(KNOWLEDGE_DIR)) {
    console.error(`❌ knowledge/ directory not found at ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(KNOWLEDGE_DIR);
  const markdownFiles = files.filter(f => extname(f) === '.md');

  if (markdownFiles.length === 0) {
    console.warn('⚠  No .md files found in knowledge/. Index will be empty.');
  }

  const hasApiCreds = !!(CF_ACCOUNT_ID && CF_API_TOKEN);
  if (!hasApiCreds) {
    console.warn(
      '⚠  CF_ACCOUNT_ID or CF_API_TOKEN not set.\n' +
      '   Embeddings will be stored as empty arrays (zero-vector placeholders).\n' +
      '   Set both env vars and re-run to generate real embeddings.\n'
    );
  } else {
    console.log(`✅ Cloudflare credentials found — will call Workers AI for embeddings`);
  }

  const allChunks = [];

  for (const file of markdownFiles) {
    const filePath = join(KNOWLEDGE_DIR, file);
    const source = basename(file, '.md');
    console.log(`\n📄 Processing ${file}…`);

    const content = readFileSync(filePath, 'utf-8');
    const chunks = chunkMarkdown(content, source);
    console.log(`   ${chunks.length} chunk(s) created`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      process.stdout.write(`   Embedding chunk ${i + 1}/${chunks.length}: "${chunk.section}"… `);

      if (hasApiCreds) {
        chunk.embedding = await fetchEmbedding(chunk.text);
        // Polite rate-limit: 50 ms between requests
        await new Promise(r => setTimeout(r, 50));
        console.log(chunk.embedding.length ? `✓ (${chunk.embedding.length}d)` : '⚠ empty');
      } else {
        chunk.embedding = [];
        console.log('(placeholder)');
      }

      allChunks.push(chunk);
    }
  }

  // Write knowledge-index.json
  const index = {
    generated: new Date().toISOString(),
    embeddingModel: EMBEDDING_MODEL,
    totalChunks: allChunks.length,
    hasRealEmbeddings: hasApiCreds,
    note: hasApiCreds
      ? undefined
      : 'Embeddings are empty placeholders. Re-run with CF_ACCOUNT_ID and CF_API_TOKEN to populate.',
    chunks: allChunks,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`\n✅ Written ${allChunks.length} chunks → ${OUTPUT_PATH}`);

  // Copy profile.json to src/assets/
  if (existsSync(PROFILE_SRC)) {
    mkdirSync(dirname(PROFILE_DEST), { recursive: true });
    const profileContent = readFileSync(PROFILE_SRC, 'utf-8');
    writeFileSync(PROFILE_DEST, profileContent, 'utf-8');
    console.log(`✅ Copied profile.json → ${PROFILE_DEST}`);
  } else {
    console.warn(`⚠  knowledge/profile.json not found — skipping asset copy`);
  }

  console.log('\n🎉 Done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

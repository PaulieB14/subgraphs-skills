#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const MANIFEST_PATH = path.join(ROOT, '.claude-plugin', 'manifest.json');

function validateManifest() {
  console.log('Validating manifest.json...');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ manifest.json not found');
    return false;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  if (!manifest.name || !manifest.version || !manifest.skills) {
    console.error('❌ manifest.json missing required fields');
    return false;
  }

  console.log(`✅ Manifest valid: ${manifest.name}@${manifest.version}`);
  return manifest;
}

function validateSkills(manifest) {
  console.log('\nValidating skills...');
  let valid = true;

  for (const skill of manifest.skills) {
    const skillPath = path.join(ROOT, skill.path);
    const skillMdPath = path.join(skillPath, 'SKILL.md');

    if (!fs.existsSync(skillPath)) {
      console.error(`❌ Skill directory not found: ${skill.path}`);
      valid = false;
      continue;
    }

    if (!fs.existsSync(skillMdPath)) {
      console.error(`❌ SKILL.md not found: ${skill.path}/SKILL.md`);
      valid = false;
      continue;
    }

    const skillContent = fs.readFileSync(skillMdPath, 'utf-8');
    const lines = skillContent.split('\n').length;

    console.log(`✅ ${skill.name}: ${lines} lines`);

    // Check for references
    const refsPath = path.join(skillPath, 'references');
    if (fs.existsSync(refsPath)) {
      const refs = fs.readdirSync(refsPath).filter(f => f.endsWith('.md'));
      console.log(`   └── ${refs.length} reference file(s)`);
    }
  }

  return valid;
}

function main() {
  console.log('🔍 Validating subgraphs-skills plugin\n');

  const manifest = validateManifest();
  if (!manifest) {
    process.exit(1);
  }

  const skillsValid = validateSkills(manifest);
  if (!skillsValid) {
    process.exit(1);
  }

  console.log('\n✅ All validations passed!');
}

main();

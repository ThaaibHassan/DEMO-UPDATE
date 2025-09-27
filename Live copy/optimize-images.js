#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple image optimization - copies and validates images
function optimizeImages() {
    console.log('🖼️  Optimizing images...');
    
    const assetsDir = path.join('.', 'assets');
    const distAssetsDir = path.join('dist', 'assets');
    
    if (!fs.existsSync(assetsDir)) {
        console.log('  ⚠️  No assets directory found');
        return;
    }
    
    // Ensure dist/assets exists
    if (!fs.existsSync(distAssetsDir)) {
        fs.mkdirSync(distAssetsDir, { recursive: true });
    }
    
    // Copy all image files
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const files = fs.readdirSync(assetsDir);
    
    let optimizedCount = 0;
    
    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (imageExtensions.includes(ext)) {
            const srcPath = path.join(assetsDir, file);
            const destPath = path.join(distAssetsDir, file);
            
            // Copy file
            fs.copyFileSync(srcPath, destPath);
            
            // Get file size for reporting
            const stats = fs.statSync(srcPath);
            const sizeKB = Math.round(stats.size / 1024);
            
            console.log(`  ✓ ${file} (${sizeKB}KB)`);
            optimizedCount++;
        }
    });
    
    // Copy subdirectories (like Brand Icons)
    const subdirs = fs.readdirSync(assetsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    subdirs.forEach(subdir => {
        const srcSubdir = path.join(assetsDir, subdir);
        const destSubdir = path.join(distAssetsDir, subdir);
        
        if (!fs.existsSync(destSubdir)) {
            fs.mkdirSync(destSubdir, { recursive: true });
        }
        
        const subdirFiles = fs.readdirSync(srcSubdir);
        subdirFiles.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            if (imageExtensions.includes(ext)) {
                const srcPath = path.join(srcSubdir, file);
                const destPath = path.join(destSubdir, file);
                fs.copyFileSync(srcPath, destPath);
                
                const stats = fs.statSync(srcPath);
                const sizeKB = Math.round(stats.size / 1024);
                console.log(`  ✓ ${subdir}/${file} (${sizeKB}KB)`);
                optimizedCount++;
            }
        });
    });
    
    console.log(`  📊 Optimized ${optimizedCount} images`);
}

// Generate image manifest for build optimization
function generateImageManifest() {
    console.log('📋 Generating image manifest...');
    
    const manifest = {
        images: [],
        generated: new Date().toISOString()
    };
    
    const assetsDir = path.join('.', 'assets');
    if (!fs.existsSync(assetsDir)) {
        return;
    }
    
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    
    function scanDirectory(dir, basePath = '') {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        
        files.forEach(file => {
            if (file.isDirectory()) {
                scanDirectory(path.join(dir, file.name), path.join(basePath, file.name));
            } else {
                const ext = path.extname(file.name).toLowerCase();
                if (imageExtensions.includes(ext)) {
                    const filePath = path.join(basePath, file.name);
                    const fullPath = path.join(dir, file.name);
                    const stats = fs.statSync(fullPath);
                    
                    manifest.images.push({
                        path: filePath,
                        size: stats.size,
                        sizeKB: Math.round(stats.size / 1024),
                        extension: ext,
                        lastModified: stats.mtime.toISOString()
                    });
                }
            }
        });
    }
    
    scanDirectory(assetsDir);
    
    // Write manifest to dist directory
    const manifestPath = path.join('dist', 'image-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`  ✓ Generated manifest with ${manifest.images.length} images`);
}

// Main function
function main() {
    try {
        optimizeImages();
        generateImageManifest();
        console.log('✅ Image optimization completed');
    } catch (error) {
        console.error('❌ Image optimization failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { optimizeImages, generateImageManifest };

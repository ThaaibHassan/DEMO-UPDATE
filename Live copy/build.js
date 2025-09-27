#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Build configuration
const BUILD_DIR = 'dist';
const SRC_DIR = '.';

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Copy static files
function copyStaticFiles() {
    console.log('📁 Copying static files...');
    
    const staticFiles = [
        'index.html',
        'privacy.html',
        'terms.html',
        'cookies.html',
        'disclaimer.html',
        'netlify.toml',
        'package.json'
    ];
    
    staticFiles.forEach(file => {
        if (fs.existsSync(path.join(SRC_DIR, file))) {
            fs.copyFileSync(path.join(SRC_DIR, file), path.join(BUILD_DIR, file));
            console.log(`  ✓ ${file}`);
        }
    });
    
    // Copy netlify directory (functions)
    if (fs.existsSync(path.join(SRC_DIR, 'netlify'))) {
        copyDirectory(path.join(SRC_DIR, 'netlify'), path.join(BUILD_DIR, 'netlify'));
        console.log(`  ✓ netlify/`);
    }
}

// Copy directory recursively
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Minify CSS
async function minifyCSS() {
    console.log('🎨 Minifying CSS...');
    
    const cssPath = path.join(SRC_DIR, 'css', 'style.css');
    if (fs.existsSync(cssPath)) {
        const css = fs.readFileSync(cssPath, 'utf8');
        const minified = new CleanCSS({ 
            level: 2,
            format: 'beautify'
        }).minify(css);
        
        if (!fs.existsSync(path.join(BUILD_DIR, 'css'))) {
            fs.mkdirSync(path.join(BUILD_DIR, 'css'), { recursive: true });
        }
        
        fs.writeFileSync(path.join(BUILD_DIR, 'css', 'style.css'), minified.styles);
        console.log('  ✓ CSS minified');
    }
}

// Minify JavaScript
async function minifyJS() {
    console.log('⚡ Minifying JavaScript...');
    
    const jsPath = path.join(SRC_DIR, 'js', 'main.js');
    if (fs.existsSync(jsPath)) {
        const js = fs.readFileSync(jsPath, 'utf8');
        const minified = await minify(js, {
            compress: true,
            mangle: true,
            format: {
                beautify: true
            }
        });
        
        if (!fs.existsSync(path.join(BUILD_DIR, 'js'))) {
            fs.mkdirSync(path.join(BUILD_DIR, 'js'), { recursive: true });
        }
        
        fs.writeFileSync(path.join(BUILD_DIR, 'js', 'main.js'), minified.code);
        console.log('  ✓ JavaScript minified');
    }
}

// Generate dynamic pages from JSON data
function generateDynamicPages() {
    console.log('📝 Generating dynamic pages...');
    
    // Generate blog.html from JSON data
    generateBlogPage();
    
    // Generate insights.html from JSON data
    generateInsightsPage();
}

function generateBlogPage() {
    const blogData = JSON.parse(fs.readFileSync(path.join(SRC_DIR, 'data', 'blog-posts.json'), 'utf8'));
    
    let blogCards = '';
    blogData.forEach(post => {
        blogCards += `
                    <div class="blog-post-card" data-reveal>
                        <img src="${post.image}" alt="${post.title} blog image">
                        <div class="card-content">
                            <div class="post-meta">
                                <span class="post-category">${post.category}</span>
                                <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                                <span class="post-read-time">${post.readTime}</span>
                            </div>
                            <h3>${post.title}</h3>
                            <p>${post.excerpt}</p>
                            ${post.featured ? '<span class="featured-badge">Featured</span>' : ''}
                        </div>
                    </div>`;
    });
    
    const blogHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog — Blackwater Industries</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="icon" type="image/png" href="assets/favicon.png">
    <meta name="description" content="Forward-thinking ideas and insights from Blackwater Industries experts">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <nav class="main-nav">
                <a href="index.html" class="logo"><img src="assets/TESlogo.svg" alt="Blackwater Industries Logo"></a>
                <button class="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
                <ul class="nav-links">
                    <li><a href="Services.html">Services</a></li>
                    <li><a href="industries.html">Industries</a></li>
                    <li><a href="insights.html">Insights</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="blog.html" class="active">BI Blog</a></li>
                    <li><a href="contact.html" class="login-btn">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="content-wrapper">
        <section class="page-intro" data-reveal>
            <div class="container text-center">
                <p class="eyebrow">Our Perspectives</p>
                <h1>Forward-Thinking Ideas</h1>
                <p class="subheadline">Our blog provides sharp takes and forward-looking ideas from our team of global experts.</p>
            </div>
        </section>

        <section class="blog-list-section" data-reveal>
            <div class="container">
                <div class="blog-list-grid">
                    ${blogCards}
                </div>
            </div>
        </section>
    </main>

    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section footer-brand">
                    <div class="footer-logo">
                        <img src="assets/TESlogo.svg" alt="Blackwater Industries Logo">
                    </div>
                    <p>Where Intelligence Meets Execution. We partner with leaders across the private, public, and social sectors to solve their most critical challenges.</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/company/blackwaterindustries" class="social-link" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="Services.html">Strategic Advisory</a></li>
                        <li><a href="Services.html">Risk & Compliance</a></li>
                        <li><a href="Services.html">Technology & Transformation</a></li>
                        <li><a href="insights.html">Research & Analysis</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Industries</h4>
                    <ul>
                        <li><a href="industries.html">Financial Services</a></li>
                        <li><a href="industries.html">Healthcare</a></li>
                        <li><a href="industries.html">Technology</a></li>
                        <li><a href="industries.html">Energy & Infrastructure</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="insights.html">Our Insights</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                        <li><a href="terms.html">Terms of Service</a></li>
                        <li><a href="cookies.html">Cookie Policy</a></li>
                        <li><a href="disclaimer.html">Disclaimer</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p class="footer-copyright">&copy; 2025 Blackwater Industries. All Rights Reserved.</p>
                    <p class="footer-disclaimer">Blackwater Industries operates as a private consulting entity. Access restricted to qualified clients only.</p>
                </div>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            const currentFile = location.pathname.split('/').pop() || 'index.html';
            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', function() {
                    const isActive = navLinks.classList.toggle('active');
                    menuToggle.classList.toggle('active', isActive);
                    menuToggle.setAttribute('aria-expanded', String(isActive));
                });
            }

            // Active nav link
            document.querySelectorAll('.nav-links a').forEach(function(link) {
                const href = link.getAttribute('href');
                if (href === currentFile) {
                    link.classList.add('active');
                }
            });
        });
    </script>
    <script src="js/main.js"></script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(BUILD_DIR, 'blog.html'), blogHTML);
    console.log('  ✓ blog.html generated');
}

function generateInsightsPage() {
    const insightsData = JSON.parse(fs.readFileSync(path.join(SRC_DIR, 'data', 'insights.json'), 'utf8'));
    
    let insightCards = '';
    insightsData.forEach(insight => {
        insightCards += `
                    <div class="insight-card" data-reveal>
                        <div class="insight-image">
                            <img src="${insight.image}" alt="${insight.title}">
                            <div class="insight-type-badge">${insight.type}</div>
                        </div>
                        <div class="insight-content">
                            <div class="insight-meta">
                                <span class="insight-category">${insight.category}</span>
                                <span class="insight-date">${new Date(insight.date).toLocaleDateString()}</span>
                            </div>
                            <h3>${insight.title}</h3>
                            <p>${insight.excerpt}</p>
                            <a href="${insight.downloadUrl}" class="insight-link">
                                ${insight.type === 'report' ? 'Download Report' : 'Read More'}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7.33 24l-2.83-2.83L16.17 9.5H7v-4h13v13h-4V10.83L7.33 24z"/>
                                </svg>
                            </a>
                            ${insight.featured ? '<span class="featured-badge">Featured</span>' : ''}
                        </div>
                    </div>`;
    });
    
    const insightsHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insights — Blackwater Industries</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="icon" type="image/png" href="assets/favicon.png">
    <meta name="description" content="Research, analysis, and insights from Blackwater Industries experts">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <nav class="main-nav">
                <a href="index.html" class="logo"><img src="assets/TESlogo.svg" alt="Blackwater Industries Logo"></a>
                <button class="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
                <ul class="nav-links">
                    <li><a href="Services.html">Services</a></li>
                    <li><a href="industries.html">Industries</a></li>
                    <li><a href="insights.html" class="active">Insights</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="blog.html">BI Blog</a></li>
                    <li><a href="contact.html" class="login-btn">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="content-wrapper">
        <section class="page-intro" data-reveal>
            <div class="container text-center">
                <p class="eyebrow">Research & Analysis</p>
                <h1>Strategic Insights</h1>
                <p class="subheadline">Deep research and analysis on the trends shaping business and society.</p>
            </div>
        </section>

        <section class="insights-grid-section" data-reveal>
            <div class="container">
                <div class="insights-grid">
                    ${insightCards}
                </div>
            </div>
        </section>
    </main>

    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section footer-brand">
                    <div class="footer-logo">
                        <img src="assets/TESlogo.svg" alt="Blackwater Industries Logo">
                    </div>
                    <p>Where Intelligence Meets Execution. We partner with leaders across the private, public, and social sectors to solve their most critical challenges.</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/company/blackwaterindustries" class="social-link" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="Services.html">Strategic Advisory</a></li>
                        <li><a href="Services.html">Risk & Compliance</a></li>
                        <li><a href="Services.html">Technology & Transformation</a></li>
                        <li><a href="insights.html">Research & Analysis</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Industries</h4>
                    <ul>
                        <li><a href="industries.html">Financial Services</a></li>
                        <li><a href="industries.html">Healthcare</a></li>
                        <li><a href="industries.html">Technology</a></li>
                        <li><a href="industries.html">Energy & Infrastructure</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="insights.html">Our Insights</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                        <li><a href="terms.html">Terms of Service</a></li>
                        <li><a href="cookies.html">Cookie Policy</a></li>
                        <li><a href="disclaimer.html">Disclaimer</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p class="footer-copyright">&copy; 2025 Blackwater Industries. All Rights Reserved.</p>
                    <p class="footer-disclaimer">Blackwater Industries operates as a private consulting entity. Access restricted to qualified clients only.</p>
                </div>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            const currentFile = location.pathname.split('/').pop() || 'index.html';
            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', function() {
                    const isActive = navLinks.classList.toggle('active');
                    menuToggle.classList.toggle('active', isActive);
                    menuToggle.setAttribute('aria-expanded', String(isActive));
                });
            }

            // Active nav link
            document.querySelectorAll('.nav-links a').forEach(function(link) {
                const href = link.getAttribute('href');
                if (href === currentFile) {
                    link.classList.add('active');
                }
            });
        });
    </script>
    <script src="js/main.js"></script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(BUILD_DIR, 'insights.html'), insightsHTML);
    console.log('  ✓ insights.html generated');
}

// Optimize images
function optimizeImages() {
    console.log('🖼️  Optimizing images...');
    
    const { optimizeImages: optImages, generateImageManifest } = require('./optimize-images.js');
    optImages();
    generateImageManifest();
}

// Main build function
async function build() {
    console.log('🚀 Starting build process...\n');
    
    try {
        copyStaticFiles();
        await minifyCSS();
        await minifyJS();
        optimizeImages();
        generateDynamicPages();
        
        console.log('\n✅ Build completed successfully!');
        console.log(`📦 Output directory: ${BUILD_DIR}/`);
        console.log('\n📋 Build summary:');
        console.log('  • Static files copied');
        console.log('  • CSS minified and optimized');
        console.log('  • JavaScript minified and optimized');
        console.log('  • Images optimized and manifest generated');
        console.log('  • Dynamic pages generated from JSON data');
        console.log('  • Blog and insights pages updated');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run build if called directly
if (require.main === module) {
    build();
}

module.exports = { build };

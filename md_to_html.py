"""
Simple Markdown to HTML converter for AccessIndia AI Project Analysis
"""
import re

# Read markdown file
input_md = r"c:\Users\Smarpit\OneDrive\Desktop\internationalhackathon\AccessIndia_AI_Project_Analysis.md"
output_html = r"c:\Users\Smarpit\OneDrive\Desktop\internationalhackathon\AccessIndia_AI_Project_Analysis.html"

print("📄 Converting Markdown to HTML...")
print(f"Input: {input_md}")
print(f"Output: {output_html}\n")

with open(input_md, 'r', encoding='utf-8') as f:
    content = f.read()

# Basic markdown to HTML conversion
html = content

# Headers
html = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
html = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
html = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)

# Bold
html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)

# Italic  
html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)

# Code blocks
html = re.sub(r'```(\w+)?\n(.*?)```', r'<pre><code>\2</code></pre>', html, flags=re.DOTALL)

# Inline code
html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)

# Links
html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', html)

# Lists
html = re.sub(r'^\- (.*?)$', r'<li>\1</li>', html, flags=re.MULTILINE)
html = re.sub(r'^\d+\. (.*?)$', r'<li>\1</li>', html, flags=re.MULTILINE)

# Horizontal rules
html = re.sub(r'^---$', r'<hr/>', html, flags=re.MULTILINE)

# Paragraphs (simple - lines without HTML tags)
lines = html.split('\n')
in_pre = False
result = []
for line in lines:
    if '<pre>' in line:
        in_pre = True
    if '</pre>' in line:
        in_pre = False
    
    if not in_pre and line.strip() and not line.strip().startswith('<'):
        result.append(f'<p>{line}</p>')
    else:
        result.append(line)

html = '\n'.join(result)

# Create full HTML document with styling
full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AccessIndia AI - Project Analysis</title>
    <style>
        @media print {{
            @page {{
                size: A4;
                margin: 2cm;
            }}
            body {{
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }}
        }}
        
        body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #0f172a;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }}
        
        h1 {{
            color: #f97316;
            border-bottom: 3px solid #f97316;
            padding-bottom: 10px;
            margin-top: 40px;
            font-size: 2em;
            page-break-after: avoid;
        }}
        
        h2 {{
            color: #ea580c;
            margin-top: 30px;
            font-size: 1.5em;
            border-bottom: 2px solid #fed7aa;
            padding-bottom: 5px;
            page-break-after: avoid;
        }}
        
        h3 {{
            color: #0f172a;
            margin-top: 25px;
            font-size: 1.2em;
            page-break-after: avoid;
        }}
        
        code {{
            background: #f1f5f9;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.9em;
            color: #dc2626;
        }}
        
        pre {{
            background: #0f172a;
            color: #f4f4f5;
            padding: 20px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.85em;
            line-height: 1.5;
            page-break-inside: avoid;
            margin: 20px 0;
        }}
        
        pre code {{
            background: transparent;
            color: #f4f4f5;
            padding: 0;
        }}
        
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            page-break-inside: avoid;
        }}
        
        th, td {{
            border: 1px solid #cbd5e1;
            padding: 12px;
            text-align: left;
        }}
        
        th {{
            background: #f1f5f9;
            font-weight: bold;
            color: #0f172a;
        }}
        
        tr:nth-child(even) {{
            background: #f8fafc;
        }}
        
        ul, ol {{
            margin: 15px 0;
            padding-left: 30px;
        }}
        
        li {{
            margin: 8px 0;
        }}
        
        a {{
            color: #2563eb;
            text-decoration: none;
        }}
        
        a:hover {{
            text-decoration: underline;
        }}
        
        strong {{
            color: #0f172a;
            font-weight: 600;
        }}
        
        hr {{
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 40px 0;
        }}
        
        p {{
            margin: 12px 0;
        }}
        
        blockquote {{
            border-left: 4px solid #f97316;
            padding-left: 20px;
            margin: 20px 0;
            color: #64748b;
            font-style: italic;
        }}
        
        .print-button {{
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f97316;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
        }}
        
        .print-button:hover {{
            background: #ea580c;
        }}
        
        @media print {{
            .print-button {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>
    
{html}

    <script>
        // Auto-print dialog on Ctrl+P
        document.addEventListener('keydown', function(e) {{
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {{
                e.preventDefault();
                window.print();
            }}
        }});
    </script>
</body>
</html>"""

# Write HTML file
with open(output_html, 'w', encoding='utf-8') as f:
    f.write(full_html)

print("✅ HTML file created successfully!")
print(f"📍 Location: {output_html}")
print(f"\n📝 To create PDF:")
print("1. Open the HTML file in your browser")
print("2. Press Ctrl+P (or click the Print button)")
print("3. Select 'Save as PDF' as the destination")
print("4. Click Save")

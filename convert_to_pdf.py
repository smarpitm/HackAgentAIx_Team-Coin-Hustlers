import markdown2
from weasyprint import HTML
import os

# Set paths
input_md = r"c:\Users\Smarpit\OneDrive\Desktop\internationalhackathon\AccessIndia_AI_Project_Analysis.md"
output_pdf = r"c:\Users\Smarpit\OneDrive\Desktop\internationalhackathon\AccessIndia_AI_Project_Analysis.pdf"

print("📄 Converting Markdown to PDF...")
print(f"Input: {input_md}")
print(f"Output: {output_pdf}\n")

try:
    # Read markdown file
    with open(input_md, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown2.markdown(md_content, extras=['tables', 'code-friendly', 'fenced-code-blocks', 'break-on-newline'])
    
    # Add CSS styling for better PDF formatting
    styled_html = f"""
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            @page {{
                size: A4;
                margin: 2cm;
            }}
            body {{
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.6;
                color: #0f172a;
                font-size: 11pt;
            }}
            h1 {{
                color: #f97316;
                border-bottom: 3px solid #f97316;
                padding-bottom: 10px;
                margin-top: 30px;
                font-size: 24pt;
                page-break-after: avoid;
            }}
            h2 {{
                color: #ea580c;
                margin-top: 25px;
                font-size: 18pt;
                border-bottom: 2px solid #fed7aa;
                padding-bottom: 5px;
                page-break-after: avoid;
            }}
            h3 {{
                color: #0f172a;
                margin-top: 20px;
                font-size: 14pt;
                page-break-after: avoid;
            }}
            code {{
                background: #f1f5f9;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 10pt;
                color: #dc2626;
            }}
            pre {{
                background: #0f172a;
                color: #f4f4f5;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 9pt;
                line-height: 1.4;
                page-break-inside: avoid;
            }}
            pre code {{
                background: transparent;
                color: #f4f4f5;
                padding: 0;
            }}
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 15px 0;
                font-size: 10pt;
                page-break-inside: avoid;
            }}
            th, td {{
                border: 1px solid #cbd5e1;
                padding: 10px;
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
            blockquote {{
                border-left: 4px solid #f97316;
                padding-left: 20px;
                margin: 20px 0;
                color: #64748b;
                font-style: italic;
            }}
            ul, ol {{
                margin: 10px 0;
                padding-left: 30px;
            }}
            li {{
                margin: 5px 0;
            }}
            a {{
                color: #2563eb;
                text-decoration: none;
            }}
            strong {{
                color: #0f172a;
            }}
            hr {{
                border: none;
                border-top: 2px solid #e2e8f0;
                margin: 30px 0;
            }}
            .page-break {{
                page-break-before: always;
            }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Convert HTML to PDF
    HTML(string=styled_html).write_pdf(output_pdf)
    
    print("✅ PDF created successfully!")
    print(f"📍 Location: {output_pdf}")
    print(f"📏 File size: {os.path.getsize(output_pdf) / 1024:.2f} KB")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n📝 Alternative methods to convert manually:")
    print("1. Upload to https://www.markdowntopdf.com/")
    print("2. Use VS Code 'Markdown PDF' extension")
    print("3. Install pandoc: pandoc AccessIndia_AI_Project_Analysis.md -o AccessIndia_AI_Project_Analysis.pdf")


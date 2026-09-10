---
name: md-to-nondeveloper-image
description: Turn a provided Markdown file into a non-developer-friendly explanatory image, save it beside the Markdown, and insert the image reference back into that file.
---

# Md To Nondeveloper Image

Use this skill when the user provides or points to a Markdown file and wants an explanatory image made from its contents, especially for audiences without a software engineering background. The expected result is both an image asset and an updated Markdown file that embeds that asset.

## Outcome

Create a clear visual summary of the Markdown content for non-developers, save the generated image in the project near the source Markdown, and insert a Markdown image reference at the most relevant location.

## Workflow

1. Read the full Markdown file first. Identify the topic, target audience, main concepts, and the best insertion point.
2. Choose only the content that should become the visual. Prefer 2-5 key ideas, comparisons, workflows, before/after states, or cause/effect relationships. Do not try to visualize the entire document when a focused image would be clearer.
3. Design for non-developers:
   - Replace technical jargon with plain-language labels while preserving official concept names when they are important.
   - Use familiar metaphors such as workplace, checklist, map, manual, assembly line, review cycle, or before/after comparison.
   - Avoid code snippets, architecture internals, tiny labels, dense flowcharts, and decorative complexity.
4. Generate a bitmap image with the `imagegen` skill or built-in image generation tool. Use `infographic-diagram` or `scientific-educational` style unless the document clearly calls for another visual form.
5. Save the final selected image beside the Markdown file unless the user names a different destination. Use a stable, descriptive filename derived from the Markdown filename and topic, for example `orientation-engineering-concepts.png`.
6. Insert the image into the Markdown near the section it explains:
   - If the image explains a specific heading, insert it immediately after that heading's intro paragraph or blockquote.
   - If it summarizes the whole document, insert it after the title/intro.
   - Use standard Markdown syntax: `![Alt text](relative-path.png)`.
7. Verify that the image file exists, has plausible dimensions, and the Markdown link is relative and resolves from the Markdown file's directory.

## Prompt Requirements

When generating the image, include:

- The intended audience: non-developers.
- The visual format: infographic, comparison diagram, workflow, or before/after, based on the Markdown.
- The exact Korean or source-language labels that must appear.
- A short plain-language explanation for each concept.
- Constraints to keep text large, readable, and not overly technical.

If the source document is Korean, keep the generated image text in Korean unless the user asks otherwise.

## Markdown Edit Rules

- Preserve existing document structure and wording except for adding the image reference.
- Do not replace the Markdown content with the image.
- Do not overwrite an existing image unless the user explicitly asks for replacement. Create a sibling versioned filename when needed.
- Use concise, useful alt text that describes the image's purpose, not just "image".
- If the repository has an existing asset convention for course images, follow it.

## Stop Condition

Finish when the generated image is saved in the workspace, the Markdown file embeds it with a valid relative path, and a file/link verification has been run. Report the changed Markdown file, image path, and validation evidence.

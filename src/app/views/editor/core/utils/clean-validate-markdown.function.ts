export const cleanAndValidateMarkdown = (markdownContent: string) => {
  let output: string = markdownContent;

  output = output.replace(/```null/g, '```markdown');
  output = output.replace(/```\n```\n/g, '```bash\n-\n```\n');

  return output;
};

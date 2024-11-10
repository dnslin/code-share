export default defineEventHandler(() => {
  return {
    popular: {
      label: "常用语言",
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "cpp", label: "C++" },
      ],
    },
    web: {
      label: "Web 开发",
      options: [
        { value: "html", label: "HTML" },
        { value: "css", label: "CSS" },
        { value: "vue", label: "Vue" },
        { value: "react", label: "React" },
      ],
    },
    backend: {
      label: "后端语言",
      options: [
        { value: "go", label: "Go" },
        { value: "rust", label: "Rust" },
        { value: "php", label: "PHP" },
        { value: "csharp", label: "C#" },
      ],
    },
  };
});

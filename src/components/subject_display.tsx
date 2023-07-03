import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FC } from "react";

interface MarkdownReaderProps {
  file: string;
}

const SubjectDisplay: FC<MarkdownReaderProps> = ({ file }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={darcula}
              language={match[1]}
              PreTag="div"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={`${className}`}>
              {children}
            </code>
          );
        },
      }}
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[gfm]}
    >
      {file}
    </ReactMarkdown>
  );
};

export default SubjectDisplay;

import React from "react";
import type { JSX } from "react/jsx-runtime";

interface TextSegment {
  type: "text" | "bold" | "italic" | "code" | "link" | "list-item" | "heading";
  content: string;
  level?: number; // for headings
  href?: string; // for links
}

export function parseFormattedText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];

  // Split text into lines to handle headings and list items properly
  const lines = text.split("\n");

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      // Add line break between lines
      segments.push({ type: "text", content: "\n" });
    }

    // Check for headings first
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      segments.push({
        type: "heading",
        content: headingMatch[2],
        level: headingMatch[1].length,
      });
      return;
    }

    // Check for list items
    const listMatch = line.match(/^[-*+]\s+(.+)$/);
    if (listMatch) {
      // Process inline formatting within list items
      const listContent = processInlineFormatting(listMatch[1]);
      segments.push({
        type: "list-item",
        content: listMatch[1],
      });
      return;
    }

    // Process inline formatting for regular text
    const inlineSegments = processInlineFormatting(line);
    segments.push(...inlineSegments);
  });

  return segments.filter(
    (segment) => segment.content.trim() !== "" || segment.type === "text"
  );
}

function processInlineFormatting(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let currentIndex = 0;

  // Find all inline formatting matches
  const matches: Array<{
    index: number;
    length: number;
    type: TextSegment["type"];
    content: string;
    href?: string;
  }> = [];

  // Bold text **text** or ***text***
  const boldRegex = /\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*/g;
  let match: any;
  while ((match = boldRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "bold",
      content: match[1] || match[2], // Handle both *** and ** patterns
    });
  }

  // Italic text *text* (but not if it's part of ** or ***)
  const italicRegex = /(?<!\*)\*([^*\s][^*]*[^*\s]|\S)\*(?!\*)/g;
  while ((match = italicRegex.exec(text)) !== null) {
    // Check if this italic is inside a bold
    const insideBold = matches.some(
      (boldMatch) =>
        match.index >= boldMatch.index &&
        match.index + match[0].length <= boldMatch.index + boldMatch.length
    );

    if (!insideBold) {
      matches.push({
        index: match.index,
        length: match[0].length,
        type: "italic",
        content: match[1],
      });
    }
  }

  // Inline code `text`
  const codeRegex = /`([^`]+)`/g;
  while ((match = codeRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "code",
      content: match[1],
    });
  }

  // Links [text](url)
  const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g;
  while ((match = linkRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "link",
      content: match[1],
      href: match[2],
    });
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Process matches and create segments
  matches.forEach((match) => {
    // Add text before this match
    if (match.index > currentIndex) {
      const textBefore = text.slice(currentIndex, match.index);
      if (textBefore) {
        segments.push({ type: "text", content: textBefore });
      }
    }

    // Add the formatted segment
    segments.push({
      type: match.type,
      content: match.content,
      href: match.href,
    });

    currentIndex = match.index + match.length;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    if (remainingText) {
      segments.push({ type: "text", content: remainingText });
    }
  }

  // If no matches found, return the entire text as a single segment
  if (segments.length === 0 && text.trim()) {
    segments.push({ type: "text", content: text });
  }

  return segments;
}

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className = "" }: FormattedTextProps) {
  const segments = parseFormattedText(text);

  return (
    <div className={className}>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case "bold":
            return (
              <strong key={index} className="font-semibold text-gray-200">
                {segment.content}
              </strong>
            );

          case "italic":
            return (
              <em key={index} className="italic text-gray-300">
                {segment.content}
              </em>
            );

          case "code":
            return (
              <code
                key={index}
                className="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700"
              >
                {segment.content}
              </code>
            );

          case "link":
            return (
              <a
                key={index}
                href={segment.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
              >
                {segment.content}
              </a>
            );

          case "heading":
            const HeadingTag = `h${Math.min(
              segment.level || 1,
              6
            )}` as keyof JSX.IntrinsicElements;
            const headingClasses = {
              1: "text-xl font-bold text-gray-200 mt-4 mb-2 first:mt-0",
              2: "text-lg font-bold text-gray-200 mt-3 mb-2 first:mt-0",
              3: "text-base font-bold text-gray-200 mt-3 mb-1 first:mt-0",
              4: "text-sm font-bold text-gray-200 mt-2 mb-1 first:mt-0",
              5: "text-sm font-semibold text-gray-200 mt-2 mb-1 first:mt-0",
              6: "text-xs font-semibold text-gray-200 mt-2 mb-1 first:mt-0",
            };

            return React.createElement(
              HeadingTag,
              {
                key: index,
                className:
                  headingClasses[
                    segment.level as keyof typeof headingClasses
                  ] || headingClasses[1],
              },
              segment.content
            );

          case "list-item":
            return (
              <div key={index} className="flex items-start mt-1 mb-1">
                <span className="text-gray-500 mr-2 mt-0.5 flex-shrink-0">
                  •
                </span>
                <div className="text-gray-400">
                  <FormattedText text={segment.content} />
                </div>
              </div>
            );

          case "text":
          default:
            // Handle line breaks in regular text
            if (segment.content === "\n") {
              return <br key={index} />;
            }
            return <span key={index}>{segment.content}</span>;
        }
      })}
    </div>
  );
}

// Simpler version for testing
export function SimpleFormattedText({
  text,
  className = "",
}: FormattedTextProps) {
  // Split by lines first to handle headings
  const lines = text.split("\n");

  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        // Check for headings
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const content = headingMatch[2];
          const HeadingTag = `h${Math.min(
            level,
            6
          )}` as keyof JSX.IntrinsicElements;
          const headingClasses = {
            1: "text-xl font-bold text-gray-200 mt-4 mb-2 first:mt-0",
            2: "text-lg font-bold text-gray-200 mt-3 mb-2 first:mt-0",
            3: "text-base font-bold text-gray-200 mt-3 mb-1 first:mt-0",
            4: "text-sm font-bold text-gray-200 mt-2 mb-1 first:mt-0",
            5: "text-sm font-semibold text-gray-200 mt-2 mb-1 first:mt-0",
            6: "text-xs font-semibold text-gray-200 mt-2 mb-1 first:mt-0",
          };

          return React.createElement(
            HeadingTag,
            {
              key: lineIndex,
              className:
                headingClasses[level as keyof typeof headingClasses] ||
                headingClasses[1],
            },
            formatInlineText(content)
          );
        }

        // Regular line with inline formatting
        return (
          <div key={lineIndex} className={lineIndex > 0 ? "mt-1" : ""}>
            {formatInlineText(line)}
          </div>
        );
      })}
    </div>
  );
}

function formatInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const allMatches: Array<{
    start: number;
    end: number;
    content: string;
    type: string;
    href?: string;
  }> = [];

  // Find bold matches (including triple asterisks)
  const boldRegex = /\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*/g;
  let match: any;
  while ((match = boldRegex.exec(text)) !== null) {
    allMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1] || match[2],
      type: "bold",
    });
  }

  // Find italic matches (but not inside bold)
  const italicRegex = /(?<!\*)\*([^*\s][^*]*[^*\s]|\S)\*(?!\*)/g;
  while ((match = italicRegex.exec(text)) !== null) {
    const insideBold = allMatches.some(
      (boldMatch) =>
        match.index >= boldMatch.start &&
        match.index + match[0].length <= boldMatch.end
    );

    if (!insideBold) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        type: "italic",
      });
    }
  }

  // Find code matches
  const codeRegex = /`([^`]+)`/g;
  while ((match = codeRegex.exec(text)) !== null) {
    allMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1],
      type: "code",
    });
  }

  // Find link matches
  const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g;
  while ((match = linkRegex.exec(text)) !== null) {
    allMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1],
      type: "link",
      href: match[2],
    });
  }

  // Sort matches by start position
  allMatches.sort((a, b) => a.start - b.start);

  // Process matches
  allMatches.forEach((match, index) => {
    // Add text before this match
    if (match.start > lastIndex) {
      const textBefore = text.slice(lastIndex, match.start);
      parts.push(textBefore);
    }

    // Add the formatted content
    switch (match.type) {
      case "bold":
        parts.push(
          <strong key={`bold-${index}`} className="font-semibold text-gray-200">
            {match.content}
          </strong>
        );
        break;
      case "italic":
        parts.push(
          <em key={`italic-${index}`} className="italic text-gray-300">
            {match.content}
          </em>
        );
        break;
      case "code":
        parts.push(
          <code
            key={`code-${index}`}
            className="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700"
          >
            {match.content}
          </code>
        );
        break;
      case "link":
        parts.push(
          <a
            key={`link-${index}`}
            href={match.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
          >
            {match.content}
          </a>
        );
        break;
    }

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If no matches, return original text
  if (parts.length === 0) {
    parts.push(text);
  }

  return parts;
}

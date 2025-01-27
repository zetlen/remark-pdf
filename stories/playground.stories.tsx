import type {Meta, StoryObj} from "@storybook/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import pdf from "../src";
import Editor from "./components/editor";
// @ts-expect-error no type definition
import text from "../fixtures/article.md";

const meta:Meta<typeof pdf> = {
    title: "Playground",
}

export default meta; 
type Story = StoryObj<typeof pdf>;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={useMemo(
      () => ({
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        fontSize: "10.5pt",
      }),
      []
    )}
  >
    {children}
  </div>
);

export const MarkdownToPdf = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const makePdf = useCallback(async contents => {
const toPdfProcessor = unified()
.use(markdown)
.use(gfm)
.use(frontmatter)
.use(pdf, { output: "blob", styles: {
  head1: {
    fontSize: 25
  }
} });

const toPdf = async (s: string) => {
const doc = await toPdfProcessor.process(s);
return doc.result as Blob;
};

            const blob = await toPdf(contents);
            if (frameRef.current) {
              frameRef.current.src = URL.createObjectURL(blob);
            }
  }, []);
  useEffect(() => { makePdf(text); }, []);
  return (
      <Wrapper>
        <Editor initialValue={text} onChange={makePdf} style={{flex:1}}/>
        <iframe ref={frameRef} style={{ flex: 1 }} />
      </Wrapper>
  );
};

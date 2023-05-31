import type { Plugin } from "unified";
import { mdastToPdf, PdfOptions, ImageDataMap } from "./transformer";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export type { PdfOptions };

/**
 * Plugin for browser
 */
export const remarkPdf: Plugin<[PdfOptions?]> = function (opts = {}) {
  let images: ImageDataMap = {};

  this.Compiler = (node) => {
    return mdastToPdf(node as any, opts, images, (def) => {
      const pdf = pdfMake.createPdf(def);
      switch (opts.output ?? "buffer") {
        case "buffer":
          return new Promise((resolve) => {
            pdf.getBuffer(resolve);
          });
        case "blob":
          return new Promise((resolve) => {
            pdf.getBlob(resolve);
          });
      }
    });
  };
};

export default remarkPdf;

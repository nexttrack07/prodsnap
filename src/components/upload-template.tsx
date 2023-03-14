import { Button } from "@mantine/core";
import { addTemplate } from "../api/template";
import { atom, useAtomValue } from "jotai";
import React, { useState } from "react";
import { CloudUpload } from "tabler-icons-react";
import {
  elementAtomsAtom,
} from "./canvas/store";

function serialize(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  });
}

const templateAtom = atom((get) => {
  const allElementAtoms = get(elementAtomsAtom);
  const elements = allElementAtoms.map((a) => get(a));

  return serialize(elements);
});

export function UploadTemplate() {
  const allElementAtoms = useAtomValue(elementAtomsAtom);

  const template = useAtomValue(templateAtom);
  const [loading, setLoading] = useState(false);

  if (allElementAtoms.length === 0) return null;

  const handleTemplateUpload = async () => {
    console.log('upload template')
    const id = allElementAtoms.reduce((acc, item) => acc + parseInt(item.toString(), 10), "");
    try {
      setLoading(true);
      await addTemplate({ id, template });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button leftIcon={<CloudUpload />} onClick={handleTemplateUpload} loading={loading}>
        Upload
      </Button>
    </>
  );
}

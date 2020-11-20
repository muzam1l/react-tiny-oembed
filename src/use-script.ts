import { useEffect } from 'react';
import type { DependencyList } from 'react';

type Attributes = {
  [key: string]: string;
};

export default function useScript(html: string, attributes?: Attributes, deps?: DependencyList): void {
  // track which scripts are currently added with hook
  let scripts: HTMLScriptElement[] = [];

  useEffect(() => {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.querySelectorAll('script').forEach((doc) => {
      const script = document.createElement('script');

      // copy attributes
      Array.from(doc.attributes).forEach((attr) => {
        if (attr.nodeName !== 'id') script.setAttribute(attr.nodeName, attr.nodeValue || '');
      });
      // copy innerHTML
      script.innerHTML = doc.innerHTML;

      // override attributes with attributes from props
      // attributes = attributes || {};
      Object.entries(attributes || {}).forEach((entry) => {
        const [key, value] = entry;
        script.setAttribute(key, value);
      });

      document.body.appendChild(script);
      scripts = scripts.concat(script);
    });
    return () => {
      scripts.forEach((script) => {
        document.body.removeChild(script);
      });
      scripts = [];
    };
  }, deps || [html]);
}

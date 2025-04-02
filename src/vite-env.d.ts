/// <reference types="vite/client" />

// Поддержка импорта картинок
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Универсальный JSX fallback (если используешь кастомные JSX-элементы)
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

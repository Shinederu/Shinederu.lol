declare global {
  interface Window {
    Twitch?: {
      Embed: new (
        elementId: string,
        options: {
          width: string | number;
          height: string | number;
          channel: string;
          layout?: string;
          theme?: string;
          parent?: [string];
        }
      ) => void;
    };
  }
}

export {};

declare module 'bundle-text:*' {
    const value: string;
    export default value;
}

declare module '*.scss' {
    const styles: Record<string, string>;
    export default styles;
}

declare module '*.hbs' {
    const value: string;
    export default value;
}

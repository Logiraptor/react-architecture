export interface Hex {
    value: string;
    clean: string;
}

export interface Fraction {
    r: number;
    g: number;
    b: number;
}

export interface Rgb {
    fraction: Fraction;
    r: number;
    g: number;
    b: number;
    value: string;
}

export interface Fraction2 {
    h: number;
    s: number;
    l: number;
}

export interface Hsl {
    fraction: Fraction2;
    h: number;
    s: number;
    l: number;
    value: string;
}

export interface Fraction3 {
    h: number;
    s: number;
    v: number;
}

export interface Hsv {
    fraction: Fraction3;
    value: string;
    h: number;
    s: number;
    v: number;
}

export interface Name {
    value: string;
    closest_named_hex: string;
    exact_match_name: boolean;
    distance: number;
}

export interface Fraction4 {
    c: number;
    m: number;
    y: number;
    k: number;
}

export interface Cmyk {
    fraction: Fraction4;
    value: string;
    c: number;
    m: number;
    y: number;
    k: number;
}

export interface Fraction5 {
    X: number;
    Y: number;
    Z: number;
}

export interface XYZ {
    fraction: Fraction5;
    value: string;
    X: number;
    Y: number;
    Z: number;
}

export interface Image {
    bare: string;
    named: string;
}

export interface Contrast {
    value: string;
}

export interface Self {
    href: string;
}

export interface Links {
    self: Self;
}

export interface Embedded {
}

export interface ColorId {
    hex: Hex;
    rgb: Rgb;
    hsl: Hsl;
    hsv: Hsv;
    name: Name;
    cmyk: Cmyk;
    XYZ: XYZ;
    image: Image;
    contrast: Contrast;
}

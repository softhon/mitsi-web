import React from 'react';
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle-1'
    | 'subtitle-2'
    | 'body-1'
    | 'body-2'
    | 'button'
    | 'caption'
    | 'overline'
    | 'paragraph';
  className?: string;
  children: React.ReactNode;
  as?: ElementType;
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  className,
  children,
  as,
}) => {
  const getDefaultElement = (
    variant: TypographyProps['variant']
  ): ElementType => {
    switch (variant) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'h5':
        return 'h5';
      case 'h6':
        return 'h6';
      case 'subtitle-1':
      case 'subtitle-2':
        return 'h6';
      case 'body-1':
      case 'body-2':
      case 'paragraph':
        return 'p';
      case 'button':
        return 'span';
      case 'caption':
        return 'span';
      case 'overline':
        return 'span';
      default:
        return 'p';
    }
  };

  const Component = as ?? getDefaultElement(variant);
  const typographyClass = `typography-${variant}`;

  return (
    <Component className={cn(typographyClass, className)}>{children}</Component>
  );
};

export { Typography };

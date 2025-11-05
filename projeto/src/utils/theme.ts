// Tema padrão para o aplicativo da Loja de Carros
import { extendTheme } from "@chakra-ui/react";

// Paleta de cores fixas para o tema escuro
const colors = {
  barber: {
    900: "#000000", // Fundo escuro - cards e elementos secundários
    800: "#121212", // Fundo um pouco mais claro
    700: "#1A1A1A", // Hover e elementos interativos
    400: "#000000", // Fundo principal do app
    100: "#FFD700", // Texto claro - dourado
  },
  button: {
    cta: "#FFD700", // Botão principal de ação - dourado
    default: "#FFF",
    gray: "#DFDFDF",
    danger: "#FF4040",
  },
  orange: {
    900: "#FFD700", // Cor de destaque principal - dourado
    800: "#DAA520", // Tom mais escuro para hover
    700: "#B8860B", // Tom mais escuro para active
  },
  brand: {
    // Cores consistentes da marca para ambos os temas
    primary: "#fba931",
    secondary: "#21222f",
    accent: "#e79a2b",
  },
};

// Fonte e tipografia
const typography = {
  fonts: {
    body: "Inter, system-ui, sans-serif",
    heading: "Inter, system-ui, sans-serif",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Bordas e sombras
const borders = {
  radii: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
};

// Estilos globais
const styles = {
  global: {
    body: {
      color: "gray.100",
      bg: "barber.400",
      transition: "all 0.2s",
    },
    a: {
      color: "#fff",
      _hover: {
        color: "orange.900",
        textDecoration: "none",
      },
    },
    "h1, h2, h3, h4, h5, h6": {
      color: "white",
    },
    // Classes de animação personalizadas
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    "@keyframes pulse": {
      "0%": { opacity: 0.6 },
      "50%": { opacity: 1 },
      "100%": { opacity: 0.6 },
    },
  },
};

// Personalizações de componentes
const components = {
  Button: {
    baseStyle: {
      fontWeight: "medium",
      borderRadius: "md",
      _focus: {
        boxShadow: "outline",
      },
    },
    variants: {
      solid: {
        bg: "orange.900",
        color: "white",
        _hover: {
          bg: "orange.800",
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
        _active: {
          bg: "orange.700",
          transform: "translateY(0)",
        },
      },
      outline: {
        borderColor: "gray.500",
        color: "white",
        _hover: {
          borderColor: "orange.900",
          color: "orange.900",
        },
      },
      ghost: {
        color: "white",
        _hover: {
          bg: "barber.700",
        },
      },
    },
    defaultProps: {
      variant: "solid",
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: "barber.900",
        borderRadius: "lg",
        overflow: "hidden",
        borderColor: "gray.600",
        transition: "all 0.2s",
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderColor: "gray.300",
        bg: "barber.900",
        color: "white",
        _placeholder: {
          color: "gray.400",
        },
      },
    },
    defaultProps: {
      focusBorderColor: "orange.900",
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderColor: "gray.300",
        bg: "barber.900",
        color: "white",
        _placeholder: {
          color: "gray.400",
        },
      },
    },
    variants: {
      filled: {
        field: {
          bg: "barber.900",
          color: "white",
          _hover: {
            bg: "barber.800",
          },
          _placeholder: {
            color: "gray.400",
          },
        },
      },
    },
    defaultProps: {
      variant: "filled",
    },
  },
  Badge: {
    baseStyle: {
      px: 2,
      py: 1,
      borderRadius: "md",
    },
    variants: {
      solid: {
        bg: "orange.900",
        color: "white",
      },
    },
  },
  Menu: {
    baseStyle: {
      list: {
        bg: "barber.900",
        borderColor: "gray.600",
      },
      item: {
        bg: "barber.900",
        color: "white",
        _hover: {
          bg: "barber.700",
        },
        _focus: {
          bg: "barber.700",
        },
      },
    },
  },
  Alert: {
    baseStyle: {
      container: {
        bg: "barber.900",
        color: "white",
      },
    },
    variants: {
      subtle: {
        container: {
          bg: "barber.900",
          color: "white",
        },
      },
    },
  },
};

// Definição de estilos semânticos
const semanticTokens = {
  colors: {
    "bg-canvas": "barber.900",
    "bg-surface": "barber.800",
    "bg-subtle": "barber.700",
    "text-primary": "white",
    "text-secondary": "barber.100",
    "border-color": "whiteAlpha.300",
    "accent-color": "brand.primary",
  },
};

// Configurações do tema já foram definidas acima

// Layer styles para aplicação consistente em ambos os temas
const layerStyles = {
  card: {
    bg: "bg-surface",
    borderRadius: "lg",
    p: "6",
    boxShadow: "sm",
    borderColor: "whiteAlpha.200",
  },
  selected: {
    bg: "bg-subtle",
    borderWidth: "1px",
    borderColor: "accent-color",
  },
};

// Construindo o tema atualizado
const theme = extendTheme({
  colors,
  ...typography,
  ...borders,
  styles,
  components,
  semanticTokens,
  layerStyles,
});

export default theme;

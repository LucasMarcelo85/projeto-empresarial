// components/enhanced-input/index.tsx
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Icon,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import { ReactElement, useState } from "react";

const MotionFormControl = motion(FormControl);

interface EnhancedInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    helperText?: string;
    leftIcon?: IconType;
    rightElement?: ReactElement;
    isDisabled?: boolean;
    autoComplete?: string;
    maxLength?: number;
    autoFocus?: boolean;
}

export function EnhancedInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    isRequired = false,
    isInvalid = false,
    errorMessage,
    helperText,
    leftIcon,
    rightElement,
    isDisabled = false,
    autoComplete,
    maxLength,
    autoFocus,
}: EnhancedInputProps) {
    const [isFocused, setIsFocused] = useState(false); // Cores fixas para o tema escuro
    const inputBg = "barber.800";
    const inputBorder = "gray.700";
    const labelColor = "gray.200";
    const iconColor = "gray.400";
    const focusBorderColor = "orange.300";
    const errorColor = "red.300";

    return (
        <MotionFormControl
            isRequired={isRequired}
            isInvalid={isInvalid}
            mb={4}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <FormLabel htmlFor={id} color={labelColor} mb={2} fontWeight="medium">
                {label}
            </FormLabel>

            <InputGroup>
                {leftIcon && (
                    <InputLeftElement pointerEvents="none">
                        <Icon as={leftIcon} color={iconColor} />
                    </InputLeftElement>
                )}{" "}
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    bg={inputBg}
                    borderColor={inputBorder}
                    _hover={{ borderColor: isFocused ? focusBorderColor : inputBorder }}
                    _focus={{
                        borderColor: focusBorderColor,
                        boxShadow: `0 0 0 1px ${focusBorderColor}`,
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    isDisabled={isDisabled}
                    autoComplete={autoComplete}
                    pl={leftIcon ? "40px" : ""}
                    maxLength={maxLength}
                    transition="all 0.2s"
                    _placeholder={{ color: "gray.400" }}
                    autoFocus={autoFocus}
                />
                {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
            </InputGroup>

            {helperText && !isInvalid && (
                <FormHelperText fontSize="sm">{helperText}</FormHelperText>
            )}

            {isInvalid && errorMessage && (
                <FormErrorMessage color={errorColor}>{errorMessage}</FormErrorMessage>
            )}
        </MotionFormControl>
    );
}

// Exportando o componente como default
export default EnhancedInput;

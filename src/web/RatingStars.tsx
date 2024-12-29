import { GoStarFill } from "react-icons/go";
import { Flex, useColorModeValue } from '@yamada-ui/react';
import { JSX, useCallback } from 'react';

type RatingStarsProps = {
  rating: number;
  onChange: (newRating: number) => void;
  disabled?: boolean;
};

export const RatingStars = ({ rating, onChange, disabled }: RatingStarsProps): JSX.Element => {
  const onClick1 = useCallback(() => rating !== 1 ? onChange(1) : onChange(0), [onChange])
  const onClick2 = useCallback(() => rating !== 2 ? onChange(2) : onChange(0), [onChange])
  const onClick3 = useCallback(() => rating !== 3 ? onChange(3) : onChange(0), [onChange])
  const onClick4 = useCallback(() => rating !== 4 ? onChange(4) : onChange(0), [onChange])
  const onClick5 = useCallback(() => rating !== 5 ? onChange(5) : onChange(0), [onChange])

  if (disabled) {
    const activeStarColor = useColorModeValue("var(--ui-colors-amber-100)", "var(--ui-colors-amber-900)")
    const inactiveStarColor = useColorModeValue("var(--ui-colors-blackAlpha-100)", "var(--ui-colors-whiteAlpha-100)")
    return (
      <Flex paddingX={1} marginBottom={-2} as='button' onClick={(e: any) => {e.stopPropagation()}}>
        <div><GoStarFill size={18} fill={rating >= 1 ? activeStarColor : inactiveStarColor} /></div>
        <div><GoStarFill size={18} fill={rating >= 2 ? activeStarColor : inactiveStarColor} /></div>
        <div><GoStarFill size={18} fill={rating >= 3 ? activeStarColor : inactiveStarColor} /></div>
        <div><GoStarFill size={18} fill={rating >= 4 ? activeStarColor : inactiveStarColor} /></div>
        <div><GoStarFill size={18} fill={rating >= 5 ? activeStarColor : inactiveStarColor} /></div>
      </Flex>
    );
  }

  const activeStarColor = useColorModeValue("var(--ui-colors-amber-500)", "var(--ui-colors-amber-400)")
  const inactiveStarColor = useColorModeValue("var(--ui-colors-blackAlpha-300)", "var(--ui-colors-whiteAlpha-300)")
  return (
    <Flex paddingX={1} marginBottom={-2} as='button' onClick={(e: any) => {e.stopPropagation()}}>
      <div onClick={onClick1}><GoStarFill size={18} fill={rating >= 1 ? activeStarColor : inactiveStarColor} /></div>
      <div onClick={onClick2}><GoStarFill size={18} fill={rating >= 2 ? activeStarColor : inactiveStarColor} /></div>
      <div onClick={onClick3}><GoStarFill size={18} fill={rating >= 3 ? activeStarColor : inactiveStarColor} /></div>
      <div onClick={onClick4}><GoStarFill size={18} fill={rating >= 4 ? activeStarColor : inactiveStarColor} /></div>
      <div onClick={onClick5}><GoStarFill size={18} fill={rating >= 5 ? activeStarColor : inactiveStarColor} /></div>
    </Flex>
  );
};
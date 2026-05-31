import React from "react";
import { TopHeader, MainHeader } from "@/components/organisms";

interface HeaderProps {
  onToggleCart: () => void;
  onToggleAccount: () => void;
  onToggleCategories: () => void;
}

export const HeaderV1: React.FC<HeaderProps> = ({
  onToggleCart,
  onToggleAccount,
  onToggleCategories,
}) => {
  return (
    <>
      <TopHeader onToggleCart={onToggleCart} onToggleAccount={onToggleAccount} />
      <MainHeader
        onToggleCategories={onToggleCategories}
        onToggleCart={onToggleCart}
        onToggleAccount={onToggleAccount}
      />
    </>
  );
};

export default HeaderV1;

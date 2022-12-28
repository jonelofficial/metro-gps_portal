import React, { useState } from "react";

const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onToggle = () => {
    setIsOpen(true);
  };
  return { isOpen, onClose, onToggle };
};

export default useDisclosure;

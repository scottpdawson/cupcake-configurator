import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import React from "react";

export function generateUniqueKey(pre: string) {
  return `${pre}_${new Date().getTime()}`;
}

export function getChevron(semaphore: boolean) {
  if (semaphore) {
    return <FaChevronDown className="chevron" />;
  } else {
    return <FaChevronRight className="chevron" />;
  }
}
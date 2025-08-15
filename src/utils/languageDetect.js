// utils/languageDetect.js

const escapeRegExp = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const detectLanguage = (code = '') => {
  const language_keywords = {
    python: ['def ', 'print(', 'import ', 'class '],
  javascript: ['function ', 'console.log(', 'let ', 'const ', 'document.getElementById'],
  typescript: ['interface ', 'type ', 'let ', 'const ', ': string', ': number'],
  java: ['import java.', 'ArrayList<', 'System.out', 'void main(', 'public class', 'new '],
  c: ['#include <stdio.h>', 'printf(', 'scanf(', 'int main('],
  cpp: ['#include', 'std::', 'cout <<', 'cin >>'],
  bash: ['#!/bin/bash', 'echo ', 'cd ', 'ls', 'pwd'],
  shell: ['#!/bin/sh', 'echo ', 'export ', 'fi'],
  sql: ['SELECT ', 'INSERT ', 'UPDATE ', 'FROM ', 'WHERE ', 'JOIN ', 'DELETE '],
  html: ['<!DOCTYPE html>', '<html>', '<div>', '<script>'],
  css: ['color:', 'font-size:', 'margin:', 'padding:'],
  go: ['package main', 'fmt.Println', 'func main()'],
  php: ['<?php', 'echo ', '$_', '->'],
  ruby: ['def ', 'puts ', 'end', 'class '],
  kotlin: ['fun main(', 'val ', 'var ', 'println('],
  swift: ['import SwiftUI', 'struct ', 'var body:', 'Text('],
  rust: ['fn main()', 'println!', 'let mut'],
  scala: ['object ', 'def ', 'val ', 'println('],
  dart: ['void main()', 'print(', 'var ', 'class '],
  };

  let bestMatch = 'plaintext';
  let maxScore = 0;

  for (const [lang, keywords] of Object.entries(language_keywords)) {
    let score = 0;

    for (const keyword of keywords) {
      const regex = new RegExp(escapeRegExp(keyword), 'g');
      const matches = (code.match(regex) || []).length;
      score += matches * Math.max(1, keyword.length / 4);
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = lang;
    }
  }

  return bestMatch;
};

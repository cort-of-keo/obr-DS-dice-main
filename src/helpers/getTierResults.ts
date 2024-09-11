import { useMemo } from "react";

import { Dice, isDice } from "../types/Dice";
import { Die, isDie } from "../types/Die";

import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";

/// adjust for reduced array depth. use d2 and d1.type etc should work

export function getTierResults(
  dice: Dice,
  values: Record<string, number>,
) {
  const finalValue = useMemo(() => {
    return getCombinedDiceValue(dice, values);
  }, [dice, values]);

  const d1: Dice = dice.dice[0];
  const d2: Dice = dice.dice[1];

  const D1: Die = d1;
  const D2: Die = d2;

  let tierResults: string[] = [];
  let intialTier: string = '';
  let finalTier: string = '';


  console.log(d1);
  console.log(D1);
  console.log(isDie(d1));
  console.log(values);


  if (dice.dice.length === 2 && D1.type === "D210" && D2.type === "D210") {
    if (finalValue < 12) { 
      intialTier = 'Tier 1';
      finalTier = 'Tier 1';
    }else if (finalValue < 17) {
      intialTier = 'Tier 2';
      finalTier = 'Tier 2';
    }
    else {
      intialTier = 'Tier 3';
      finalTier = 'Tier 3';}
  }




  if (dice.dice.length === 2 && D1.type === "D210" && D2.type === "D210") {
    if (d1.combination === "D EDGE"){
      if (finalValue < 12) { finalTier = 'Tier 2'}
      else if (finalValue < 17) { finalTier = 'Tier 3'}
      else {finalTier = 'Tier 3'} 
    } else if (d1.combination === "D BANE") {
      if (finalValue > 17) { finalTier = 'Tier 2'}
      else if (finalValue > 12) { finalTier = 'Tier 2'}
      else {finalTier = 'Tier 1'} 
    } 
  }


  if (dice.dice.length === 2 && D1.type === "D210" && D2.type === "D210") {
    if ((values[D1.id] === 10 && values[D2.id] === 10) || (values[D1.id] === 9 && values[D2.id] === 10) || (values[D1.id] === 10 && values[D2.id] === 9) ) { finalTier = 'Critical!'}
    
  }

  tierResults = [intialTier, finalTier];


  return tierResults


}
import { useMemo } from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";

import { DiceRoll } from "../types/DiceRoll";
import { Die, isDie } from "../types/Die";
import { Dice, isDice } from "../types/Dice";
import { DicePreview } from "../previews/DicePreview";

export function DiceResults({
  diceRoll,
  rollValues,
  expanded,
  onExpand,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
  expanded: boolean;
  onExpand: (expand: boolean) => void;
}) {
  const finalValue = useMemo(() => {
    return getCombinedDiceValue(diceRoll, rollValues);
  }, [diceRoll, rollValues]);

 // const tiers = useMemo(() => {
 //   return getTierResults(diceRoll, rollValues);
 // }, [diceRoll, rollValues]);

  const die = useMemo(() => {diceRoll.dice.filter(isDie).sort((a,b) => 0)}, [diceRoll,rollValues]);

 


  console.log(die);
  console.log(diceRoll);
  console.log(rollValues);
 //console.log(tiers);

  return (
    <Stack alignItems="center" maxHeight="calc(100vh - 100px)">
      <Tooltip
        title={expanded ? "Hide Breakdown" : "Show Breakdown"}
        disableInteractive
      >
        <Button
          sx={{ pointerEvents: "all", padding: 0.5, minWidth: "40px" }}
          onClick={() => onExpand(!expanded)}
          color="inherit"
        >
          <Typography variant="h4" color="white">
            {finalValue}
          </Typography>
          <Typography variant="h4" color="white">
          &nbsp;
          </Typography>
         
        </Button>
      </Tooltip>
      <Grow
        in={expanded}
        mountOnEnter
        unmountOnExit
        style={{ transformOrigin: "50% 0 0" }}
      >
        <Stack overflow="auto" sx={{ pointerEvents: "all" }}>
          <DiceResultsExpanded diceRoll={diceRoll} rollValues={rollValues} />
        </Stack>
      </Grow>
    </Stack>
  );
}


/// adjust for reduced array depth. use d2 and d1.type etc should work

function getTierResults(
  dice: Dice,
  values: Record<string, number>,
) {
  const finalValue = useMemo(() => {
    return getCombinedDiceValue(dice, values);
  }, [dice, values]);

  const d1 = dice.dice[0];
  const d2 = dice.dice[1];

  let tierResults: string[] = [];
  let intialTier: string = '';
  let finalTier: string = '';


  console.log(d1);
  console.log(d1.combination);
  console.log(values);


  if (d1.dice.length === 2 && d1.dice[0].type === "D210" && d1.dice[1].type === "D210") {
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




  if (d1.dice.length === 2 && d1.dice[0].type === "D210" && d1.dice[1].type === "D210") {
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


  if (d1.dice.length === 2 && d1.dice[0].type === "D210" && d1.dice[1].type === "D210") {
    if ((values[d1.dice[0].id] === 10 && values[d1.dice[1].id] === 10) || (values[d1.dice[0].id] === 9 && values[d1.dice[1].id] === 10) || (values[d1.dice[0].id] === 10 && values[d1.dice[1].id] === 9) ) { finalTier = 'Critical!'}
    
  }

  tierResults = [intialTier, finalTier];


  return tierResults


}


function combination(dice: Dice) {
  if (dice.combination === "D EDGE") {
    return ">";
  } else if (dice.combination === "D BANE") {
    return "<";
  } else if (dice.combination === "NONE") {
    return ",";
  } else {
    return "+";
  }
}

function sortDice(
  die: Die[],
  rollValues: Record<string, number>,
  combination: "D EDGE" | "D BANE" | "SUM" | "NONE" | undefined
) {
  return die.sort((a, b) => {
    const aValue = rollValues[a.id];
    const bValue = rollValues[b.id];
    if (combination === "D EDGE") {
      return bValue - aValue;
    } else if (combination === "D BANE") {
      return aValue - bValue;
    } else {
      return 0;
    }
  });
}

function DiceResultsExpanded({
  diceRoll,
  rollValues,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
}) {
  const die = useMemo(
    () =>
      sortDice(diceRoll.dice.filter(isDie), rollValues, diceRoll.combination),
    [diceRoll, rollValues]
  );
  const dice = useMemo(() => diceRoll.dice.filter(isDice), [diceRoll]);
 
  console.log(die);
  console.log(dice);



  return (
    <Stack divider={<Divider />} gap={1}>
      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
        {die.map((d, i) => (
          <Stack direction="row" key={d.id} gap={1}>
            <DicePreview diceStyle={d.style} diceType={d.type} size="small" />
            <Typography lineHeight="28px" color="white">
              {rollValues[d.id]}
            </Typography>
            {i < die.length - 1 && (
              <Typography lineHeight="28px" color="white">
                {combination(diceRoll)}
              </Typography>
            )}
          </Stack>
        ))}
        {die.length > 0 && (
          <>
            <Typography lineHeight="28px" color="white">
              =
            </Typography>
            <Typography lineHeight="28px" color="white">
              {getCombinedDiceValue(
                { dice: die, combination: diceRoll.combination },
                rollValues
              )}
            </Typography>
          </>
        )}
      </Stack>
      {dice.map((d, i) => (
        <DiceResultsExpanded key={i} diceRoll={d} rollValues={rollValues} />
      ))}
      {diceRoll.bonus && (
        <Typography textAlign="center" lineHeight="28px" color="white">
          {diceRoll.bonus > 0 && "+"}
          {diceRoll.bonus}
        </Typography>
      )}
    </Stack>
  );
}

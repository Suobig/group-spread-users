import _ from "lodash";

import { User, TPair } from "./users";

export type TMatrix = number[][];

function getPairQuality(timesMet: number): number {
  switch (timesMet) {
    case 0:
      //never meeting is no good
      return 200;
    case 1:
      //best case
      return 0;
    case 2:
      //it's ok to meet more than once
      return 5;
    case 3:
      //but not too often
      return 10;
    default:
      //definitely not THAT often
      return 50;
  }
}

export function initMeetingMatrix(numUsers: number): TMatrix {
  return Array(numUsers)
    .fill(null)
    .map((_) => new Array(numUsers).fill(0));
}

//assume pair is ordered ASC
function getTimesMet(pair: TPair, matrix: TMatrix): number {
  const [first, second] = pair;
  return matrix[first.id][second.id];
}

function getPairs(groups: User[][]): TPair[] {
  let pairs: TPair[] = [];

  groups.forEach((group) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        //Lower ID should always go first
        if (group[i].id < group[j].id) {
          pairs.push([group[i], group[j]]);
        } else {
          pairs.push([group[j], group[i]]);
        }
      }
    }
  });

  return pairs;
}

export function getQualityDiff(groups: User[][], matrix: TMatrix): number {
  const pairs = getPairs(groups);

  let qualityBefore = 0;
  let qualityAfter = 0;

  pairs.forEach((pair) => {
    const [user1, user2] = pair;
    const weights = user1.weight + user2.weight;
    const timesMet = getTimesMet(pair, matrix);
    qualityBefore += getPairQuality(timesMet) * weights;
    qualityAfter += getPairQuality(timesMet + 1) * weights;
  }, 0);

  return qualityAfter - qualityBefore;
}

export function getMatrixQuality(matrix: TMatrix) {
  let quality = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      quality += getPairQuality(matrix[i][j]);
    }
  }
  return quality;
}

export function getUpdatedMatrix(groups: User[][], matrix: TMatrix) {
  const newMatrix = _.cloneDeep(matrix);

  const pairs: TPair[] = getPairs(groups);
  const firstMetPairs: TPair[] = [];
  pairs.forEach((pair) => {
    const [first, second] = pair;
    if (newMatrix[first.id][second.id] === 0) {
      firstMetPairs.push(pair);
    }
    newMatrix[first.id][second.id] += 1;
  });

  return { newMatrix, firstMetPairs };
}

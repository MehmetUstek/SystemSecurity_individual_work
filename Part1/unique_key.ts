import data from "./homeowners.json" assert { type: "json" };
import fs from "fs";
export type UserData = {
  name: string;
  chino: string;
  medication: string;
  county: string;
  city: string;
  ethnicity: string;
  volume: number;
};

function displayEachUniqueKey(data: object[]) {
  const uniqueKeys: string[] = Array.from(
    new Set<string>(data.flatMap((obj) => Object.keys(obj))) // Set allows storing the value only once, making it unique.
  );
  return uniqueKeys;
}

const uniqueKeys = displayEachUniqueKey(data as object[]);
const content = uniqueKeys.join("\n");
fs.writeFile("uniquekeys.txt", content, function (err: any) {
  if (err) {
    console.log(err);
  }
});

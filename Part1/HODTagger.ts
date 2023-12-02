import { promises as fsPromises, writeFile, readFileSync } from "fs";
import data from "./homeowners.json" assert { type: "json" };
import tags from "./tags.json" assert { type: "json" }; // Read from the tagged tags.json data.

export type CSVTag = {
  Field: string;
  Tag: string;
};
export type DataMap = Record<string, string>;

function writeJsonFile(content: any, filepath: string) {
  const jsonString = JSON.stringify(content, null, 2);
  writeFile(filepath, jsonString, function (err: any) {
    if (err) {
      console.log(err);
    }
  });
}

function createTaggedHomeowners(tagPairs: DataMap, data: object[]) {
  const newData = data.map((item: any) => {
    const newItem: DataMap = {};
    for (const field in item) {
      const newFieldName = tagPairs[field];
      newItem[newFieldName] = item[field];
    }
    return newItem;
  });
  const jsonString = JSON.stringify(newData, null, 2);

  writeFile("taggedhomeowners.json", jsonString, function (err: any) {
    if (err) {
      console.log(err);
    }
  });
}
createTaggedHomeowners(tags, data as object[]);

function profileHOFields() {
  const filePath = "./taggedhomeowners.json";

  // Read the JSON file synchronously
  const jsonData = readFileSync(filePath, "utf8");

  // Parse the JSON content
  const taggedData = JSON.parse(jsonData);
  let sensitive_count: number = 0;
  let highly_sensitive_count: number = 0;
  let low_sensitive_count: number = 0;
  let quasi_sensitive_count: number = 0;
  let healthcare_count: number = 0;
  let financial_count: number = 0;
  let hsi_financial_count: number = 0;
  let si_financial_count: number = 0;
  let qsi_financial_count: number = 0;
  let lsi_financial_count: number = 0;
  let demographic_count: number = 0;
  let house_count: number = 0;
  let total_data_count: number = 0;
  taggedData.forEach((obj: object) => {
    Object.keys(obj).forEach((value) => {
      total_data_count++;
      const regex_qsi = /qsi/i;
      const regex_hsi = /hsi/i;
      const regex_si = /\bsi\b/i;
      const regex_lsi = /lsi/i;
      const regex_healthcare = /healthcare/i;
      const regex_house = /house/i;
      const regex_demographic = /demographic/i;
      const regex_financial = /financial/i;
      const regex_hsi_financial = /hsi-financial/i;
      const regex_si_financial = /\bsi-financial/i;
      const regex_qsi_financial = /qsi-financial/i;
      const regex_lsi_financial = /lsi-financial/i;
      if (regex_qsi.test(value)) {
        quasi_sensitive_count++;
      }
      if (regex_hsi.test(value)) {
        highly_sensitive_count++;
      }
      if (regex_si.test(value)) {
        sensitive_count++;
      }
      if (regex_lsi.test(value)) {
        low_sensitive_count++;
      }
      if (regex_healthcare.test(value)) {
        healthcare_count++;
      }
      if (regex_house.test(value)) {
        house_count++;
      }
      if (regex_demographic.test(value)) {
        demographic_count++;
      }
      if (regex_financial.test(value)) {
        financial_count++;
      }
      if (regex_hsi_financial.test(value)) {
        hsi_financial_count++;
      }
      if (regex_si_financial.test(value)) {
        si_financial_count++;
      }
      if (regex_qsi_financial.test(value)) {
        qsi_financial_count++;
      }
      if (regex_lsi_financial.test(value)) {
        lsi_financial_count++;
      }
    });
  });
  const percentages = {
    quasi_percentage: Number(quasi_sensitive_count / total_data_count).toFixed(
      2
    ),
    highly_sensitive_percentage: Number(
      highly_sensitive_count / total_data_count
    ).toFixed(2),
    low_sensitive_percentage: Number(
      low_sensitive_count / total_data_count
    ).toFixed(2),
    sensitive_percentage: Number(sensitive_count / total_data_count).toFixed(2),
    healthcare_percentage: Number(healthcare_count / total_data_count).toFixed(
      2
    ),
    house_percentage: Number(house_count / total_data_count).toFixed(2),
    demographic_percentage: Number(
      demographic_count / total_data_count
    ).toFixed(2),
    financial_percentage: Number(financial_count / total_data_count).toFixed(2),
    hsi_financial_percentage: Number(
      hsi_financial_count / total_data_count
    ).toFixed(2),
    si_financial_percentage: Number(
      si_financial_count / total_data_count
    ).toFixed(2),
    qsi_financial_percentage: Number(
      qsi_financial_count / total_data_count
    ).toFixed(2),
    lsi_financial_percentage: Number(
      lsi_financial_count / total_data_count
    ).toFixed(2),
    hsi_financial_to_financial: Number(
      hsi_financial_count / financial_count
    ).toFixed(2),
    si_financial_to_financial: Number(
      si_financial_count / financial_count
    ).toFixed(2),
    qsi_financial_to_financial: Number(
      qsi_financial_count / financial_count
    ).toFixed(2),
    lsi_financial_to_financial: Number(
      lsi_financial_count / financial_count
    ).toFixed(2),
  };
  const jsonString = JSON.stringify(percentages, null, 2);
  writeFile("percentages.json", jsonString, function (err: any) {
    if (err) {
      console.log(err);
    }
  });
}

function createNewDatawarehouse() {
  const filePath = "./taggedhomeowners.json";

  const jsonData = readFileSync(filePath, "utf8");

  const taggedData = JSON.parse(jsonData);
  const regex_healthcare = /healthcare/i;
  const regex_house = /house/i;
  const regex_demographic = /demographic/i;
  const regex_financial = /financial/i;
  const regex_fullname = /fullname/i;
  const regex_address = /address/i;
  const filteredHealthcareRecords: any[] = [];
  const filteredFinancialFullnameRecords: any[] = [];
  const filteredHouseRecords: any[] = [];
  const filteredMADRecords: any[] = [];

  taggedData.forEach((record: any) => {
    const filteredHealthcareRecord: any = {};
    const filteredFinancialFullnameRecord: any = {};
    const filteredHouseRecord: any = {};
    const filteredMADRecord: any = {};
    for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        const value = record[key];
        if (regex_healthcare.test(key)) {
          filteredHealthcareRecord[key] = value;
        }
        if (regex_financial.test(key) || regex_fullname.test(key)) {
          filteredFinancialFullnameRecord[key] = value;
        }

        if (regex_house.test(key)) {
          filteredHouseRecord[key] = value;
        }
        if (
          regex_demographic.test(key) ||
          regex_healthcare.test(key) ||
          regex_address.test(key)
        ) {
          filteredMADRecord[key] = value;
        }
      }
    }
    if (Object.keys(filteredHealthcareRecord).length > 0) {
      filteredHealthcareRecords.push(filteredHealthcareRecord);
    }

    if (Object.keys(filteredFinancialFullnameRecord).length > 0) {
      filteredFinancialFullnameRecords.push(filteredFinancialFullnameRecord);
    }

    if (Object.keys(filteredHouseRecord).length > 0) {
      filteredHouseRecords.push(filteredHouseRecord);
    }
    if (Object.keys(filteredMADRecord).length > 0) {
      filteredMADRecords.push(filteredMADRecord);
    }
  });

  writeJsonFile(filteredHealthcareRecords, "homeowners-m.json");
  writeJsonFile(filteredHouseRecords, "homeowners-h.json");
  writeJsonFile(filteredFinancialFullnameRecords, "homeowners-f-f.json");
  writeJsonFile(filteredMADRecords, "homeowners-m-a-d.json");
}

setTimeout(() => {
  console.log("Delayed action: Finished. ");
  profileHOFields();

  createNewDatawarehouse();
}, 5000); // Delay for 5 seconds for ensuring it converges. It can be way shorter.

console.log("Wait for taggedhomeowners.json to finish writing.");

function calculateImpact(currentlyInfected, data) {
  let days = null;
  const time = data.timeToElapse;
  if (data.periodType === 'days') {
    days = time;
  }
  if (data.periodType === 'weeks') {
    days = time * 7;
  }
  if (data.periodType === 'months') {
    days = time * 30;
  }
  const {
    region,
    totalHospitalBeds
  } = data;
  const {
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD
  } = region;
  const factor = Math.trunc(days / 3);
  const infectionsByRequestedTime = currentlyInfected * 2 ** factor;
  const severeCasesByRequestTime = 0.15 * infectionsByRequestedTime;
  const beds = 0.35 * totalHospitalBeds - severeCasesByRequestTime;
  const hospitalBedsByRequestTime = Math.trunc(beds);
  const casesForICUByRequestedTime = Math.trunc(
    0.05 * infectionsByRequestedTime
  );
  const casesForVentilatorsByRequestTime = Math.trunc(
    0.02 * infectionsByRequestedTime
  );
  const avgLoss = infectionsByRequestedTime * avgDailyIncomeInUSD * avgDailyIncomePopulation * days;
  const dollarsInFlight = avgLoss;
  const result = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestTime,
    hospitalBedsByRequestTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestTime,
    dollarsInFlight
  };
  return result;
}
const covid19ImpactEstimator = (data) => {
  const currentlyInfected = data.reportedCases * 10;
  const currentSevereInfected = data.reportedCases * 50;
  const result = {
    data,
    impact: calculateImpact(currentlyInfected, data),
    severeImpact: calculateImpact(currentSevereInfected, data)
  };
  return result;
};

export default covid19ImpactEstimator;

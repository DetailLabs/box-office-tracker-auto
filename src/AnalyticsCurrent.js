import React from "react";
import Analytics from "./AnalyticsBase";

export default function AnalyticsCurrent({ weekends, selectedWeekend }) {
  return <Analytics theme="current" weekends={weekends} selectedWeekend={selectedWeekend} />;
}

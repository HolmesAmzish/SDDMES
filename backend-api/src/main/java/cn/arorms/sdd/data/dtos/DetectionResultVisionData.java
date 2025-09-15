package cn.arorms.sdd.data.dtos;

import java.util.List;
import java.util.Map;

public class DetectionResultVisionData {
    private Map<String, Long> defectTypeCounts;
    private Map<String, Long> timeDistribution;
    private Map<Integer, Long> defectNumberDistribution;
    private List<DailyDetectionCount> dailyDetectionCounts;
    private List<DefectSummary> recentDefectSummaries;

    // Getters and setters
    public Map<String, Long> getDefectTypeCounts() {
        return defectTypeCounts;
    }

    public void setDefectTypeCounts(Map<String, Long> defectTypeCounts) {
        this.defectTypeCounts = defectTypeCounts;
    }

    public Map<String, Long> getTimeDistribution() {
        return timeDistribution;
    }

    public void setTimeDistribution(Map<String, Long> timeDistribution) {
        this.timeDistribution = timeDistribution;
    }

    public Map<Integer, Long> getDefectNumberDistribution() {
        return defectNumberDistribution;
    }

    public void setDefectNumberDistribution(Map<Integer, Long> defectNumberDistribution) {
        this.defectNumberDistribution = defectNumberDistribution;
    }

    public List<DailyDetectionCount> getDailyDetectionCounts() {
        return dailyDetectionCounts;
    }

    public void setDailyDetectionCounts(List<DailyDetectionCount> dailyDetectionCounts) {
        this.dailyDetectionCounts = dailyDetectionCounts;
    }

    public List<DefectSummary> getRecentDefectSummaries() {
        return recentDefectSummaries;
    }

    public void setRecentDefectSummaries(List<DefectSummary> recentDefectSummaries) {
        this.recentDefectSummaries = recentDefectSummaries;
    }

    // Inner classes for structured data
    public static class DailyDetectionCount {
        private String date;
        private Long count;

        public DailyDetectionCount() {}

        public DailyDetectionCount(String date, Long count) {
            this.date = date;
            this.count = count;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Long getCount() {
            return count;
        }

        public void setCount(Long count) {
            this.count = count;
        }
    }

    public static class DefectSummary {
        private String date;
        private Long totalDefects;
        private Long inclusionCount;
        private Long patchCount;
        private Long scratchCount;
        private Long otherCount;

        public DefectSummary() {}

        public DefectSummary(String date, Long totalDefects, Long inclusionCount, Long patchCount, Long scratchCount, Long otherCount) {
            this.date = date;
            this.totalDefects = totalDefects;
            this.inclusionCount = inclusionCount;
            this.patchCount = patchCount;
            this.scratchCount = scratchCount;
            this.otherCount = otherCount;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Long getTotalDefects() {
            return totalDefects;
        }

        public void setTotalDefects(Long totalDefects) {
            this.totalDefects = totalDefects;
        }

        public Long getInclusionCount() {
            return inclusionCount;
        }

        public void setInclusionCount(Long inclusionCount) {
            this.inclusionCount = inclusionCount;
        }

        public Long getPatchCount() {
            return patchCount;
        }

        public void setPatchCount(Long patchCount) {
            this.patchCount = patchCount;
        }

        public Long getScratchCount() {
            return scratchCount;
        }

        public void setScratchCount(Long scratchCount) {
            this.scratchCount = scratchCount;
        }

        public Long getOtherCount() {
            return otherCount;
        }

        public void setOtherCount(Long otherCount) {
            this.otherCount = otherCount;
        }
    }
}

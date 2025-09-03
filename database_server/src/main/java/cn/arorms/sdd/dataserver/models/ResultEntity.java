package cn.arorms.sdd.dataserver.models;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class ResultEntity {
    private int figId;
    private String name;
    private byte[] resFig;
    private Timestamp date;
    private String time;
    private String label;
    private String num;
    private String dice;
}

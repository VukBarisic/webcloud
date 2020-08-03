package model;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import helpers.LocalDateTimeDeserializer;
import helpers.LocalDateTimeSerializer;


public class Activity {
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	private LocalDateTime dateTurnedOn;
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	private LocalDateTime dateTurnedOff;
	
	public Activity() {
	}

	public Activity(LocalDateTime dateTurnedOn) {
		this.dateTurnedOn = dateTurnedOn;
	}

	

	public LocalDateTime getDateTurnedOn() {
		return dateTurnedOn;
	}

	public void setDateTurnedOn(LocalDateTime dateTurnedOn) {
		this.dateTurnedOn = dateTurnedOn;
	}

	public LocalDateTime getDateTurnedOff() {
		return dateTurnedOff;
	}

	public void setDateTurnedOff(LocalDateTime dateTurnedOff) {
		this.dateTurnedOff = dateTurnedOff;
	}

}

package model;

import java.time.LocalDate;

public class Activity {

	private LocalDate dateTurnedOn;
	private LocalDate dateTurnedOff;

	public Activity(LocalDate dateTurnedOn, LocalDate dateTurnedOff) {
		this.dateTurnedOn = dateTurnedOn;
		this.dateTurnedOff = dateTurnedOff;
	}

	public LocalDate getDateTurnedOn() {
		return dateTurnedOn;
	}

	public void setDateTurnedOn(LocalDate dateTurnedOn) {
		this.dateTurnedOn = dateTurnedOn;
	}

	public LocalDate getDateTurnedOff() {
		return dateTurnedOff;
	}

	public void setDateTurnedOff(LocalDate dateTurnedOff) {
		this.dateTurnedOff = dateTurnedOff;
	}

}

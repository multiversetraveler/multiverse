--	use multiversedb_test executar em ambos ambientes;
	use multiversedb;

	CREATE TABLE quality(
		quality_id int(15) NOT NULL AUTO_INCREMENT,
		description	varchar(2000) NOT NULL,
		PRIMARY KEY (quality_id)
	);

	CREATE TABLE type(
		type_id int(15) NOT NULL AUTO_INCREMENT,
		description	varchar(2000) NOT NULL,
		PRIMARY KEY (type_id)
	);

	CREATE TABLE tag(
		tag_id int(15) NOT NULL AUTO_INCREMENT,
		description	varchar(2000) NOT NULL,
		PRIMARY KEY (tag_id)
	);

	CREATE TABLE card(
		card_id 	int(15) NOT NULL AUTO_INCREMENT,
		name 		varchar(100) NOT NULL,
		imageUrl 	varchar(2000) NOT NULL,
		description varchar(2000) NOT NULL,
		quality_id  int(15) NOT NULL,
		tag_id      int(15) NOT NULL,
		type_id   	int(15) NOT NULL,
		rarity  	int(2) NOT NULL,
		user 		varchar(100) NOT NULL,
		data DATE NOT NULL,
		update_date DATE,
		PRIMARY KEY (card_id),
		FOREIGN KEY (quality_id) REFERENCES quality(quality_id),
		FOREIGN KEY (tag_id) REFERENCES tag(tag_id),
		FOREIGN KEY (type_id) REFERENCES type(type_id)
	);
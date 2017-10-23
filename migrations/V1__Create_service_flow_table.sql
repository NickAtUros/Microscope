-- Create video metadata schema
CREATE TABLE svc_flow (
    id SERIAL NOT NULL,
    from_svc varchar(2048) NOT NULL,
    to_svc varchar(2048) NOT NULL,
    sent_time timestamp without time zone default (now() at time zone 'utc'),
    PRIMARY KEY(id)
);

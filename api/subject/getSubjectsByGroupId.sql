SELECT * FROM "subject" as s
INNER JOIN "visits" as v ON s.subject_id = v.subject_id
WHERE v.group_id = $1

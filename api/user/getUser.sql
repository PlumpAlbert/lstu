SELECT
u.user_id, u.user_login, u.user_password, u.user_admin,
g.group_id, g.group_name
FROM "user" as u
INNER JOIN "group" as g
ON g.group_id = u.group_id
WHERE u.user_id = $1

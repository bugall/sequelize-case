# sequelize-case
description deadlock in sequelize transaction use autocommit=0

# environmental
nodejs - v5.1
mysql - innodb v5.6

# user table config

```
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `age` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6156 DEFAULT CHARSET=utf8
```

# Case
After the project running for some time,terminal will print some deadlock message
![image](https://github.com/bugall/sequelize-case/blob/master/pic/lock.png)

pay a attation the sql in the red box,number in the left of the red box is connection-id,
we find that connection not revert after finish transaction work. it to execute a 'UPDATE' sentance without commit.
at this time,this connection holding a lock until the 'UPDATE' sentance be commited.
![image](https://github.com/bugall/sequelize-case/blob/master/pic/mysql-log.png)

in other case, use navicat for mysql software
![image](https://github.com/bugall/sequelize-case/blob/master/pic/transcation.png)

this sentance can not finish because the connection can't to get the lock.
finally,it show the message 'lock wait timeout'
![image](https://github.com/bugall/sequelize-case/blob/master/pic/update.png)


# How fix the bug 
set the autocommit=1 in the tansaction config

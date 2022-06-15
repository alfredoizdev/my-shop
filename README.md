# Next js my shop

We need run our database

```
docker-compose up -d
```

-  -d mean **detached**

-  Mongodb URL Local

## seeting variables env

Rename the file **.env.template** to **.env**

-  MongoDB URL local

```
MONGO_URL=mongodb://localhost:27017/myshopdb
```

-  Install package

```
yarn install
yarn dev
```

## fill the database with data test

call

```
http://locahos:3000/api/seed
```

## demo of this app

```
https://myshop-next.herokuapp.com/
```

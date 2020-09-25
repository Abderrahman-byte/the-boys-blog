# The Boys Blog

The Boys Blog is a full stack blog with custom adming user interface.
made using **Python/Django** in the back-end and **React JS** in the front-end.

DEMO : ```none```

## To Be Done Later :

- [ ] Add ```Helmet``` for front-end headers.
- [*] Change favicon.
- [ ] Add Footer.
- [ ] ```contact``` and ```about``` pages.
- [ ] ```settings.py``` must be changed to adapte with production envirement.

## Deployement steps :

* **Clone Repo**

```shell
git clone https://github.com/Abderrahman-byte/the-boys-blog.git
```

* **Start virtual envirement**

```shell
pipenv shell
pipenv sync 
```

* **Start virtual envirement**

```shell
./manage.py makemigrations
./manage.py migrate
./manage.py collectstatic
```

* **Start production server**

Nginx configuration :
```nginx
server {
    listen 80;
    server_name theboyslink.fr *.theboyslink.fr;

location / {
               proxy_pass http://127.0.0.1:8000/;
               proxy_read_timeout 300;
               proxy_redirect off;
               proxy_buffering off;
               proxy_store off;
               proxy_set_header Host $host;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     }
 
     location /static/ {
        alias /home/username/www/staticFiles/;
    }

    location /media/ {
        alias /home/username/www/media/;
    }
}
```

Start wsgi server and restart nginx:
```shell
gunicorn full_stack_blog.wsgi:application --bind=127.0.0.1:8000 --daemon
sudo systemctl restart nginx
```

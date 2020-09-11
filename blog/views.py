from django.shortcuts import render
from django.conf.urls.static import serve, static
from django.conf import settings

import os

def index(request, path) :
    print('index.html')
    # print(dir(request))
    # print(request.is_ajax())
    # print(request.content_type)
    media_dir = os.path.join(settings.BASE_DIR, 'react-ui/build')
    try : 
        return serve(request, path, document_root=media_dir)
    except :
        return render(request, 'index.html')
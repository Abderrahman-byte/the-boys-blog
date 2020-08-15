from django.conf import settings
from django.core.files.storage import FileSystemStorage

import string, random, os

def getRandomId(length=11) :
    allowed = string.ascii_letters + string.digits
    return ''.join([random.choice(allowed) for _ in range(length)])

def upload_file(file, dir=None) :
    fs = FileSystemStorage()
    filename, ext = os.path.splitext(file.name)
    filename = f'{getRandomId(35)}{ext}'

    if dir is not None :
        filename = os.path.join(dir, filename)
    
    fn = fs.save(filename, file)
    file_url = fs.url(fn)
    return file_url

def delete_file(file_path) :
    full_path = os.path.join(settings.MEDIA_ROOT, file_path)
    if not os.path.exists(full_path) :
        return False
    
    os.remove(full_path)
    return True
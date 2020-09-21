from django.conf import settings
from django.core.files.storage import FileSystemStorage

# import nltk
from textblob import TextBlob
import string, random, os, json, re, time
from collections import Counter
# nltk.download()

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

def get_content(article) :
    content = json.loads(article.content)
    content = [
        block.get('data').get('text')
        for block in content.get('blocks', [])
        if block.get('data') is not None and block.get('data').get('text') is not None
    ]

    return ' '.join(content)

def sortbyrepitition(item) :
    return item[1]

def extract_phrases(text) :
    blob = TextBlob(text)
    return blob.noun_phrases

def get_keywords(text) :
    start = time.time()
    count = Counter(extract_phrases(text)).most_common()
    sorted_count = list(filter(lambda word: word[1] > 1, count))
    sorted_count.sort(reverse=True, key=sortbyrepitition)
    avg = sum([word[1] for word in sorted_count if word[1] > 1]) / len(sorted_count)

    print(sorted_count)
    open('log.json', 'w').write(json.dumps(count, indent=4))
    return ''

def get_related_article(article, Article) :
    categories = article.categories.all()
    author = article.author
    content = get_content(article)
    keywords = get_keywords(content)
    
    return []
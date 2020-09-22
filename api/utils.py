from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db.models import Q

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

def first_class_querie(categories, kwords, author) :
    categories_q = Q(categories__in=[category.id for category in categories])
    author_q = Q(author=author)
    kwords_q = Q()
    for word in kwords : 
        kwords_q |= Q(content__icontains=word)
        kwords_q |= Q(title__icontains=word)
    combined = Q()
    combined &= kwords_q
    combined &= categories_q
    combined &= author_q
    return combined

def second_class_querie(categories, kwords) :
    categories_q = Q(categories__in=[category.id for category in categories])
    kwords_q = Q()
    for word in kwords : 
        kwords_q |= Q(content__icontains=word)
        kwords_q |= Q(title__icontains=word)
    combined = Q()
    combined &= kwords_q
    combined &= categories_q
    return combined

def third_class_querie(kwords) :
    kwords_q = Q()
    for word in kwords : 
        kwords_q |= Q(content__icontains=word)
        kwords_q |= Q(title__icontains=word)
    return kwords_q

def get_keywords(text) :
    start = time.time()
    count = Counter(extract_phrases(text)).most_common()
    sorted_count = list(filter(lambda word: word[1] > 1, count))
    sorted_count.sort(reverse=True, key=sortbyrepitition)

    return [word[0] for word in sorted_count]

def get_related_article(article, Article, count=3) :
    results = Article.objects.none()
    categories = article.categories.all()
    author = article.author
    content = get_content(article)
    keywords = get_keywords(content)

    first_class = Article.objects.filter(first_class_querie(categories, keywords, author)).exclude(id=str(article.id))
    second_class = Article.objects.filter(second_class_querie(categories, keywords)).exclude(id=str(article.id))
    third_class = Article.objects.filter(third_class_querie(keywords)).exclude(id=str(article.id))
    fourth_class = Article.objects.filter(Q(categories__in=[category.id for category in categories])).exclude(id=str(article.id))

    results |= first_class
    results |= second_class
    results |= third_class
    results |= fourth_class
    results = results.distinct()[0:count]

    print('title', article.title)
    print(results)
    return results
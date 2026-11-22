def two_lines(text):
    words=text.split()
    if len(text)<=42:return text
    choices=[(' '.join(words[:i]),' '.join(words[i:])) for i in range(1,len(words))]
    left,right=min(choices,key=lambda p:(max(len(p[0]),len(p[1])),abs(len(p[0])-len(p[1]))))
    if max(len(left),len(right))>42:raise ValueError('Caption phrase is too long for two readable lines')
    return left+'\n'+right

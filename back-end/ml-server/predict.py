import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt


# 지난 번에 학습했던 모델을 불러오기
model = keras.models.load_model('ml-server/CNN_model.h5')
# model.summary()

# 누스타 5 테스트
test_num = plt.imread('ml-server/image.png')
test_num = test_num[:,:,0]
test_num = (test_num > 0.1) * test_num
test_num = test_num.astype('float32')

# plt.imshow(test_num, cmap="Greys", interpolation='nearest')
test_num = test_num.reshape((1, 28, 28, 1))

# plt.show()
print('휴먼, 당신이 쓴 글자는... ', model.predict_classes(test_num), '가 맞습니까?')

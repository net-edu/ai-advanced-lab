import unittest

from calc import moving_average, is_close_enough, add_record


class TestMovingAverage(unittest.TestCase):
    def test_covers_all_windows(self):
        result = moving_average([1, 2, 3, 4], window=2)
        self.assertEqual(result, [1.5, 2.5, 3.5])


class TestIsCloseEnough(unittest.TestCase):
    def test_tiny_float_error_is_ignored(self):
        self.assertTrue(is_close_enough(0.1 + 0.2, 0.3))


class TestAddRecord(unittest.TestCase):
    def test_independent_histories(self):
        first = add_record(10)
        second = add_record(20)
        self.assertEqual(second, [20])


if __name__ == "__main__":
    unittest.main()

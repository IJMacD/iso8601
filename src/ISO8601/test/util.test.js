import { rationalise } from '../util';

describe("Rationalise", () => {
    test("Zero", () => {
        expect(rationalise(0)).toStrictEqual([1,0]);
    });

    test("Integers", () => {
        expect(rationalise(1)).toStrictEqual([1,1]);
        expect(rationalise(2)).toStrictEqual([1,2]);
        expect(rationalise(3)).toStrictEqual([1,3]);
        expect(rationalise(4)).toStrictEqual([1,4]);
        expect(rationalise(8)).toStrictEqual([1,8]);
        expect(rationalise(12)).toStrictEqual([1,12]);
        expect(rationalise(100)).toStrictEqual([1,100]);
    });

    test("Negative Integers", () => {
        expect(rationalise(-1)).toStrictEqual([1,-1]);
        expect(rationalise(-2)).toStrictEqual([1,-2]);
        expect(rationalise(-3)).toStrictEqual([1,-3]);
        expect(rationalise(-4)).toStrictEqual([1,-4]);
        expect(rationalise(-8)).toStrictEqual([1,-8]);
        expect(rationalise(-12)).toStrictEqual([1,-12]);
        expect(rationalise(-100)).toStrictEqual([1,-100]);
    });

    test("Small Denominator", () => {
        expect(rationalise(1/2)).toStrictEqual([2,1]);
        expect(rationalise(1/3)).toStrictEqual([3,1]);
        expect(rationalise(2/3)).toStrictEqual([3,2]);
        expect(rationalise(1/4)).toStrictEqual([4,1]);
        expect(rationalise(3/4)).toStrictEqual([4,3]);
        expect(rationalise(1/5)).toStrictEqual([5,1]);
        expect(rationalise(2/5)).toStrictEqual([5,2]);
        expect(rationalise(3/5)).toStrictEqual([5,3]);
        expect(rationalise(4/5)).toStrictEqual([5,4]);
        expect(rationalise(1/6)).toStrictEqual([6,1]);
        expect(rationalise(5/6)).toStrictEqual([6,5]);
        expect(rationalise(1/7)).toStrictEqual([7,1]);
        expect(rationalise(2/7)).toStrictEqual([7,2]);
        expect(rationalise(3/7)).toStrictEqual([7,3]);
        expect(rationalise(4/7)).toStrictEqual([7,4]);
        expect(rationalise(5/7)).toStrictEqual([7,5]);
        expect(rationalise(6/7)).toStrictEqual([7,6]);
        expect(rationalise(1/8)).toStrictEqual([8,1]);
        expect(rationalise(3/8)).toStrictEqual([8,3]);
        expect(rationalise(5/8)).toStrictEqual([8,5]);
        expect(rationalise(7/8)).toStrictEqual([8,7]);
        expect(rationalise(1/9)).toStrictEqual([9,1]);
        expect(rationalise(2/9)).toStrictEqual([9,2]);
        expect(rationalise(4/9)).toStrictEqual([9,4]);
        expect(rationalise(5/9)).toStrictEqual([9,5]);
        expect(rationalise(7/9)).toStrictEqual([9,7]);
        expect(rationalise(8/9)).toStrictEqual([9,8]);
    });

    test("Small Denominator Negative", () => {
        expect(rationalise(-1/2)).toStrictEqual([2,-1]);
        expect(rationalise(-1/3)).toStrictEqual([3,-1]);
        expect(rationalise(-2/3)).toStrictEqual([3,-2]);
        expect(rationalise(-1/4)).toStrictEqual([4,-1]);
        expect(rationalise(-3/4)).toStrictEqual([4,-3]);
        expect(rationalise(-1/5)).toStrictEqual([5,-1]);
        expect(rationalise(-2/5)).toStrictEqual([5,-2]);
        expect(rationalise(-3/5)).toStrictEqual([5,-3]);
        expect(rationalise(-4/5)).toStrictEqual([5,-4]);
        expect(rationalise(-1/6)).toStrictEqual([6,-1]);
        expect(rationalise(-5/6)).toStrictEqual([6,-5]);
        expect(rationalise(-1/7)).toStrictEqual([7,-1]);
        expect(rationalise(-2/7)).toStrictEqual([7,-2]);
        expect(rationalise(-3/7)).toStrictEqual([7,-3]);
        expect(rationalise(-4/7)).toStrictEqual([7,-4]);
        expect(rationalise(-5/7)).toStrictEqual([7,-5]);
        expect(rationalise(-6/7)).toStrictEqual([7,-6]);
        expect(rationalise(-1/8)).toStrictEqual([8,-1]);
        expect(rationalise(-3/8)).toStrictEqual([8,-3]);
        expect(rationalise(-5/8)).toStrictEqual([8,-5]);
        expect(rationalise(-7/8)).toStrictEqual([8,-7]);
        expect(rationalise(-1/9)).toStrictEqual([9,-1]);
        expect(rationalise(-2/9)).toStrictEqual([9,-2]);
        expect(rationalise(-4/9)).toStrictEqual([9,-4]);
        expect(rationalise(-5/9)).toStrictEqual([9,-5]);
        expect(rationalise(-7/9)).toStrictEqual([9,-7]);
        expect(rationalise(-8/9)).toStrictEqual([9,-8]);
    });


    test("Small Denominator Mixed", () => {
        expect(rationalise(3/2)).toStrictEqual([2,3]);
        expect(rationalise(5/2)).toStrictEqual([2,5]);
        expect(rationalise(4/3)).toStrictEqual([3,4]);
        expect(rationalise(7/3)).toStrictEqual([3,7]);
        expect(rationalise(5/3)).toStrictEqual([3,5]);
        expect(rationalise(8/3)).toStrictEqual([3,8]);
        expect(rationalise(5/4)).toStrictEqual([4,5]);
        expect(rationalise(9/4)).toStrictEqual([4,9]);
        expect(rationalise(7/4)).toStrictEqual([4,7]);
        expect(rationalise(11/4)).toStrictEqual([4,11]);
        expect(rationalise(6/5)).toStrictEqual([5,6]);
        expect(rationalise(11/5)).toStrictEqual([5,11]);
        expect(rationalise(7/5)).toStrictEqual([5,7]);
        expect(rationalise(12/5)).toStrictEqual([5,12]);
        expect(rationalise(8/5)).toStrictEqual([5,8]);
        expect(rationalise(13/5)).toStrictEqual([5,13]);
        expect(rationalise(9/5)).toStrictEqual([5,9]);
        expect(rationalise(14/5)).toStrictEqual([5,14]);
        expect(rationalise(7/6)).toStrictEqual([6,7]);
        expect(rationalise(13/6)).toStrictEqual([6,13]);
        expect(rationalise(11/6)).toStrictEqual([6,11]);
        expect(rationalise(17/6)).toStrictEqual([6,17]);
        expect(rationalise(8/7)).toStrictEqual([7,8]);
        expect(rationalise(15/7)).toStrictEqual([7,15]);
        expect(rationalise(9/7)).toStrictEqual([7,9]);
        expect(rationalise(16/7)).toStrictEqual([7,16]);
        expect(rationalise(10/7)).toStrictEqual([7,10]);
        expect(rationalise(17/7)).toStrictEqual([7,17]);
        expect(rationalise(11/7)).toStrictEqual([7,11]);
        expect(rationalise(18/7)).toStrictEqual([7,18]);
        expect(rationalise(12/7)).toStrictEqual([7,12]);
        expect(rationalise(19/7)).toStrictEqual([7,19]);
        expect(rationalise(13/7)).toStrictEqual([7,13]);
        expect(rationalise(20/7)).toStrictEqual([7,20]);
    });

});